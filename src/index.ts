import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Provider } from '@ethersproject/abstract-provider'
import { Signer, Contract, constants, utils, ContractInterface } from 'ethers'
import { getBytesFromRoles, parseEvents, getRolesFromBytes } from './utils'
import { Credentials } from './types'

function signData(signer: Signer, types: string[], values: any[]) {
    let message = utils.arrayify(
        utils.keccak256(utils.defaultAbiCoder.encode(types, values))
    )
    return signer.signMessage(message)
}

function getSigner(types: string[], values: any[], signature: string) {
    let message = utils.arrayify(
        utils.keccak256(utils.defaultAbiCoder.encode(types, values))
    )
    return utils.verifyMessage(message, signature)
}

export async function createCredentials(
    signer: Signer,
    to: Contract,
    fragment: string,
    args: any[]
): Promise<Credentials> {
    const nullCredential = {
        to: constants.AddressZero,
        call: constants.HashZero,
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
    const len = utils.defaultAbiCoder.encode(types, args).length
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
    signer: Signer,
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

export async function getAllShieldAddresses(signer: Signer) {}

export async function createShield(
    signer: SignerWithAddress,
    name: string,
    roles: any[],
    users: any[],
    policy: any[],
    factory?: Contract,
    iface?: utils.Interface
) {
    const _name = utils.formatBytes32String(name)
    const _roles = roles.map(utils.formatBytes32String)
    const _users = users.map(function (user: { roles: string[]; addr: any }) {
        const rolesAssigned = user.roles.map(utils.formatBytes32String)
        return {
            addr: user.addr,
            roles: getBytesFromRoles(rolesAssigned, _roles),
        }
    })
    const _policy = policy.map(function (step: string[]) {
        const rolesAssigned = step.map(utils.formatBytes32String)
        return getBytesFromRoles(rolesAssigned, _roles)
    })
    const shieldTx = await factory
        .connect(signer)
        .createShield(_name, _roles, _users, _policy)
    const [_, address] = await parseEvents('ShieldCreated', shieldTx)
    return createShieldInstance(signer, address, iface)
}

export async function createShieldInstance(
    signer: Signer | Provider,
    address: string,
    iface?: ContractInterface
) {
    let contract = new Contract(address, iface, signer)
    return new Shield(contract)
}

export class Shield {
    public contract: Contract

    constructor(contract: Contract) {
        this.contract = contract
    }

    async getRoles() {
        const roles = await this.contract.getRoles()
        return roles.map(utils.parseBytes32String)
    }

    async createCredentialsForAddRoles(signer: Signer, roles: string[]) {
        const newRoles = roles.map(utils.formatBytes32String)
        return createCredentials(signer, this.contract, 'addRoles', [newRoles])
    }

    async addRoles(
        signer: string | Signer | Provider,
        roles: string[],
        credentials: any
    ) {
        const newRoles = roles.map(utils.formatBytes32String)
        return this.contract.connect(signer).addRoles(newRoles, credentials)
    }

    async getUsers() {}

    async getUser(address: any) {
        const roles = await this.contract.getRoles()
        const bits = await this.contract.getUser(address)
        return getRolesFromBytes(bits, roles).map(utils.parseBytes32String)
    }

    async createCredentialsForSetUser(
        signer: Signer,
        address: any,
        roles: string[]
    ) {
        const existingRoles = await this.contract.getRoles()
        const newRoles = getBytesFromRoles(
            roles.map(utils.formatBytes32String),
            existingRoles
        )
        return createCredentials(signer, this.contract, 'setUser', [
            address,
            newRoles,
        ])
    }

    async setUser(
        signer: string | Signer | Provider,
        address: any,
        roles: string[],
        credentials: any
    ) {
        const existingRoles = await this.contract.getRoles()
        const newRoles = getBytesFromRoles(
            roles.map(utils.formatBytes32String),
            existingRoles
        )
        return this.contract
            .connect(signer)
            .setUser(address, newRoles, credentials)
    }

    async getPolicys() {}

    async getPolicy(label: string) {
        const roles = await this.contract.getRoles()
        const policy = await this.contract.getPolicy(
            utils.formatBytes32String(label)
        )
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(utils.parseBytes32String)
        })
    }

    async createCredentialsForAddPolicy(
        signer: Signer,
        label: string,
        policy: any[]
    ) {
        const roles = await this.contract.getRoles()
        const newLabel = utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(step.map(utils.formatBytes32String), roles)
        })
        return createCredentials(signer, this.contract, 'addPolicy', [
            newLabel,
            newPolicy,
        ])
    }

    async addPolicy(
        signer: string | Signer | Provider,
        label: string,
        policy: any[],
        credentials: any
    ) {
        const roles = await this.contract.getRoles()
        const newLabel = utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(step.map(utils.formatBytes32String), roles)
        })
        return this.contract
            .connect(signer)
            .addPolicy(newLabel, newPolicy, credentials)
    }

    async getAssignedPolicies() {}

    async getAssignedPolicy(
        to: { interface: { getSighash: (arg0: any) => any }; address: any },
        f: any
    ) {
        const roles = await this.contract.getRoles()
        let sig = to.interface.getSighash(f)
        const policy = await this.contract.getAssignedPolicy(to.address, sig)
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(utils.parseBytes32String)
        })
    }

    async createCredentialsForAssignPolicy(
        signer: Signer,
        to: { interface: { getSighash: (arg0: any) => any }; address: any },
        f: any,
        label: string
    ) {
        const sig = to.interface.getSighash(f)
        const newLabel = utils.formatBytes32String(label)
        return createCredentials(signer, this.contract, 'assignPolicy', [
            to.address,
            sig,
            newLabel,
        ])
    }

    async assignPolicy(
        signer: string | Signer | Provider,
        to: { interface: { getSighash: (arg0: any) => any }; address: any },
        f: any,
        label: string,
        credentials: any
    ) {
        const sig = to.interface.getSighash(f)
        const newLabel = utils.formatBytes32String(label)
        return this.contract
            .connect(signer)
            .assignPolicy(to.address, sig, newLabel, credentials)
    }

    async isPaused() {
        return this.contract.paused()
    }

    async createCredentialsForPause(signer: Signer) {
        return createCredentials(signer, this.contract, 'pause', [])
    }

    async pause(signer: string | Signer | Provider, credentials: any) {
        return this.contract.connect(signer).pause(credentials)
    }

    async createCredentialsForUnpause(signer: Signer) {
        return createCredentials(signer, this.contract, 'unpause', [])
    }

    async unpause(signer: string | Signer | Provider, credentials: any) {
        return this.contract.connect(signer).unpause(credentials)
    }
    
    async createCredentialsForTransfer(signer: Signer, to: string, amount: number) {
        return createCredentials(signer, this.contract, 'transfer', [to, amount])
    }

    async transfer(signer: string | Signer | Provider, to: string, amount: number, credentials: any) {
        return this.contract.connect(signer).transfer(to, amount, credentials)
    }

    async burnCredentials(signer: string | Signer | Provider, credentials: any) {
        return this.contract.connect(signer).burnCredentials(credentials)
    }

    async validateCredentials(credentials: {
        to: any
        call: string | any[]
        timestamp: any
        approvals: string[]
        signer: any
    }, full: boolean):Promise<string[]> {
        const signer = await getSigner(
            ['address', 'bytes', 'uint'],
            [credentials.to, credentials.call, credentials.timestamp],
            credentials.approvals[0]
        );
        return this.contract.validateCredentials(
            credentials,
            credentials.signer,
            credentials.to,
            credentials.call.slice(0, 10),
            credentials.call,
            full
        );
    }
}
