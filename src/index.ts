import { ethers } from 'ethers'
import { getBytesFromRoles, parseEvents, getRolesFromBytes } from './utils'
import { Credentials } from './types'

function signData(signer: ethers.Signer, types: string[], values: any[]) {
    let message = ethers.utils.arrayify(
        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(types, values))
    )
    return signer.signMessage(message)
}

function getSigner(types: string[], values: any[], signature: string) {
    let message = ethers.utils.arrayify(
        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(types, values))
    )
    return ethers.utils.verifyMessage(message, signature)
}

export async function createCredentials(
    signer: ethers.Signer,
    to: ethers.Contract,
    fragment: string,
    args: any[]
): Promise<Credentials> {
    const nullCredential = {
        to: ethers.constants.AddressZero,
        call: ethers.constants.HashZero,
        timestamp: 0,
        approvals: [],
    }
    let call = to.interface.encodeFunctionData(fragment, [
        ...args,
        nullCredential,
    ])
    let types = to.interface.getFunction(fragment).inputs.map(function (input) {
        return input.type
    })
    types = types.slice(0, -1)
    const len = ethers.utils.defaultAbiCoder.encode(types, args).length
    call = call.slice(0, len + 8)
    const timestamp = Math.floor(new Date().getTime())
    const signature = await signData(
        signer,
        ['address', 'bytes', 'uint'],
        [to.address, call, timestamp]
    )
    return { to: to.address, call, timestamp, approvals: [signature] }
}

export async function approveCredentials(
    signer: ethers.Signer,
    credentials: Credentials
): Promise<Credentials> {
    const { to, call, timestamp, approvals } = credentials
    const lastSignature = approvals[approvals.length - 1]
    const signature = await signData(signer, ['bytes'], [lastSignature])
    return { to, call, timestamp, approvals: [...approvals, signature] }
}

export function encodeCredentials(credentials: Credentials): string {
    const { to, call, timestamp, approvals } = credentials

    return btoa(
        JSON.stringify({ to, call, timestamp, approvals: approvals.map(btoa) })
    )
}

export function decodeCredentials(encodedCredentials: string): Credentials {
    const { to, call, timestamp, approvals } = JSON.parse(
        atob(encodedCredentials)
    )
    return { to, call, timestamp, approvals: approvals.map(atob) }
}

export async function getShields(provider, address: string, factory?: ethers.Contract) {
    const currentBlock = await provider.getBlockNumber()
    const firstBlock = factory.deployTransaction.blockNumber
    let events = await factory.queryFilter('UserAdded', firstBlock, currentBlock)
    const shields = new Set<string>();
    events.forEach(function(event){
        const [shield, user] = event.args;
        shields.add(shield);
    });
    return Array.from(shields);
}

export async function createShield(
    signer: ethers.Signer,
    name: string,
    roles: any[],
    users: any[],
    policy: any[],
    factory?: ethers.Contract,
    iface?: ethers.utils.Interface
) {
    const _name = ethers.utils.formatBytes32String(name)
    const _roles = roles.map(ethers.utils.formatBytes32String)
    const _users = users.map(function (user: { roles: string[]; addr: any }) {
        const rolesAssigned = user.roles.map(ethers.utils.formatBytes32String)
        return {
            addr: user.addr,
            roles: getBytesFromRoles(rolesAssigned, _roles),
        }
    })
    const _policy = policy.map(function (step: string[]) {
        const rolesAssigned = step.map(ethers.utils.formatBytes32String)
        return getBytesFromRoles(rolesAssigned, _roles)
    })
    const shieldTx = await factory
        .connect(signer)
        .createShield(_name, _roles, _users, _policy)
    const [_, address] = await parseEvents('ShieldCreated', shieldTx)
    return createShieldInstance(signer, address, iface)
}

export async function createShieldInstance(
    signer: ethers.Signer,
    address: string,
    iface?: ethers.ContractInterface
) {
    let contract = new ethers.Contract(address, iface, signer)
    return new Shield(contract)
}

export class Shield {
    public contract: ethers.Contract

    constructor(contract: ethers.Contract) {
        this.contract = contract
    }

    async getRoles() {
        const roles = await this.contract.getRoles()
        return roles.map(ethers.utils.parseBytes32String)
    }

    async createCredentialsForAddRoles(signer: ethers.Signer, roles: string[]) {
        const newRoles = roles.map(ethers.utils.formatBytes32String)
        return createCredentials(signer, this.contract, 'addRoles', [newRoles])
    }

    async addRoles(
        signer: ethers.Signer,
        roles: string[],
        credentials: Credentials
    ) {
        const newRoles = roles.map(ethers.utils.formatBytes32String)
        return this.contract.connect(signer).addRoles(newRoles, credentials)
    }

    async getUsers(provider) {
        const currentBlock = await provider.getBlockNumber()
        const firstBlock = (await this.contract.born()).toNumber()
        let events = await this.contract.queryFilter('UserSet', firstBlock, currentBlock)
        const roles = await this.contract.getRoles()
        const users = {};
        events.forEach(function(event){
            const [user, bits] = event.args;
            users[user] = getRolesFromBytes(bits, roles).map(ethers.utils.parseBytes32String)
        });
        return users;
    }

    async getUser(address: any) {
        const roles = await this.contract.getRoles()
        const bits = await this.contract.getUser(address)
        return getRolesFromBytes(bits, roles).map(ethers.utils.parseBytes32String)
    }

    async createCredentialsForSetUser(
        signer: ethers.Signer,
        address: any,
        roles: string[]
    ) {
        const existingRoles = await this.contract.getRoles()
        const newRoles = getBytesFromRoles(
            roles.map(ethers.utils.formatBytes32String),
            existingRoles
        )
        return createCredentials(signer, this.contract, 'setUser', [
            address,
            newRoles,
        ])
    }

    async setUser(
        signer: ethers.Signer,
        address: any,
        roles: string[],
        credentials: Credentials
    ) {
        const existingRoles = await this.contract.getRoles()
        const newRoles = getBytesFromRoles(
            roles.map(ethers.utils.formatBytes32String),
            existingRoles
        )
        return this.contract
            .connect(signer)
            .setUser(address, newRoles, credentials)
    }

    async getPolicies(provider) {
        const currentBlock = await provider.getBlockNumber()
        const firstBlock = (await this.contract.born()).toNumber()
        let events = await this.contract.queryFilter('PolicyAdded', firstBlock, currentBlock)
        const roles = await this.contract.getRoles()
        const policies = {};
        events.forEach(function(event){
            const [label, policy] = event.args;
            const decodedLabel = ethers.utils.parseBytes32String(label);
            const decodedPolicy = policy.map(function (bits: any) {
                                return getRolesFromBytes(bits, roles).map(ethers.utils.parseBytes32String)
                            });
            policies[decodedLabel] = decodedPolicy;
        });
        return policies;
    }

    async getPolicy(label: string) {
        const roles = await this.contract.getRoles()
        const policy = await this.contract.getPolicy(
            ethers.utils.formatBytes32String(label)
        )
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(ethers.utils.parseBytes32String)
        })
    }

    async createCredentialsForAddPolicy(
        signer: ethers.Signer,
        label: string,
        policy: any[]
    ) {
        const roles = await this.contract.getRoles()
        const newLabel = ethers.utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(step.map(ethers.utils.formatBytes32String), roles)
        })
        return createCredentials(signer, this.contract, 'addPolicy', [
            newLabel,
            newPolicy,
        ])
    }

    async addPolicy(
        signer: ethers.Signer,
        label: string,
        policy: any[],
        credentials: Credentials
    ) {
        const roles = await this.contract.getRoles()
        const newLabel = ethers.utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(step.map(ethers.utils.formatBytes32String), roles)
        })
        return this.contract
            .connect(signer)
            .addPolicy(newLabel, newPolicy, credentials)
    }
    
    async getAssignedPolicies(provider) {
        const currentBlock = await provider.getBlockNumber()
        const firstBlock = (await this.contract.born()).toNumber()
        let events = await this.contract.queryFilter('PolicyAssigned', firstBlock, currentBlock)
        const assignments = {};
        const iface = this.contract.interface;
        events.forEach(function(event){
            const [to, sig, label] = event.args;
            if (!(to in assignments)){
                assignments[to] = {};
            }
            const decodedLabel = ethers.utils.parseBytes32String(label);
            const f = iface.getFunction(sig).name;
            assignments[to][f] = decodedLabel;
        });
        return assignments;
    }

    async getAssignedPolicy(
        to: ethers.Contract,
        f: string
    ) {
        const roles = await this.contract.getRoles()
        let sig = to.interface.getSighash(f)
        const policy = await this.contract.getAssignedPolicy(to.address, sig)
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(ethers.utils.parseBytes32String)
        })
    }

    async createCredentialsForAssignPolicy(
        signer: ethers.Signer,
        to: ethers.Contract,
        f: string,
        label: string
    ) {
        const sig = to.interface.getSighash(f)
        const newLabel = ethers.utils.formatBytes32String(label)
        return createCredentials(signer, this.contract, 'assignPolicy', [
            to.address,
            sig,
            newLabel,
        ])
    }

    async assignPolicy(
        signer: ethers.Signer,
        to: ethers.Contract,
        f: string,
        label: string,
        credentials: Credentials
    ) {
        const sig = to.interface.getSighash(f)
        const newLabel = ethers.utils.formatBytes32String(label)
        return this.contract
            .connect(signer)
            .assignPolicy(to.address, sig, newLabel, credentials)
    }

    async isPaused() {
        return this.contract.paused()
    }

    async createCredentialsForPause(signer: ethers.Signer) {
        return createCredentials(signer, this.contract, 'pause', [])
    }

    async pause(signer: ethers.Signer, credentials: Credentials) {
        return this.contract.connect(signer).pause(credentials)
    }

    async createCredentialsForUnpause(signer: ethers.Signer) {
        return createCredentials(signer, this.contract, 'unpause', [])
    }

    async unpause(signer: ethers.Signer, credentials: Credentials) {
        return this.contract.connect(signer).unpause(credentials)
    }
    
    async createCredentialsForTransfer(signer: ethers.Signer, to: string, amount: number) {
        return createCredentials(signer, this.contract, 'transfer', [to, amount])
    }

    async transfer(signer: ethers.Signer, to: string, amount: number, credentials: Credentials) {
        return this.contract.connect(signer).transfer(to, amount, credentials)
    }

    async burnCredentials(signer: ethers.Signer, credentials: Credentials) {
        return this.contract.connect(signer).burnCredentials(credentials)
    }

    async validateCredentials(credentials: Credentials, full: boolean):Promise<string[]> {
        const signer = await getSigner(
            ['address', 'bytes', 'uint'],
            [credentials.to, credentials.call, credentials.timestamp],
            credentials.approvals[0]
        );
        return this.contract.validateCredentials(
            credentials,
            signer,
            credentials.to,
            credentials.call.slice(0, 10),
            credentials.call,
            full
        );
    }
}
