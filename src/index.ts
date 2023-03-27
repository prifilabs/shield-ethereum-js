import { ethers } from 'ethers'
import { getBytesFromRoles, getRolesFromBytes } from './utils'
import { Credentials } from './types'

import CONFIG from './config.json'
import SHIELD from '../artifacts/contracts/Shield.sol/Shield.json'
import FACTORY from '../artifacts/contracts/ShieldFactory.sol/ShieldFactory.json'

const SHIELD_INTERFACE = new ethers.utils.Interface(SHIELD.abi)

function signData(signer: ethers.Signer, types: string[], values: any[]) {
    let message = ethers.utils.arrayify(
        ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(types, values)
        )
    )
    return signer.signMessage(message)
}

function getSigner(types: string[], values: any[], signature: string) {
    let message = ethers.utils.arrayify(
        ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(types, values)
        )
    )
    return ethers.utils.verifyMessage(message, signature)
}

export async function getDefaultFactory(
    signer: ethers.Signer,
    network: string
): Promise<ethers.Contract> {
    if (!(network in CONFIG))
        throw new Error(`Shield Factory not deployed on ${network}`)
    return new ethers.Contract(CONFIG[network], FACTORY.abi, signer)
}

export async function createCredentials(
    signer: ethers.Signer,
    to: ethers.Contract,
    func: string,
    args: any[]
): Promise<Credentials> {
    const nullCredential = {
        to: ethers.constants.AddressZero,
        call: ethers.constants.HashZero,
        timestamp: 0,
        approvals: [],
    }
    let call = to.interface.encodeFunctionData(func, [...args, nullCredential])
    // types = types.slice(0, -1)
    // const len = ethers.utils.defaultAbiCoder.encode(types, args).length
    // call = call.slice(0, len + 8)
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

export async function getShieldName(
    address: string,
    factory: ethers.Contract
): Promise<string> {
    let events = await factory.queryFilter('ShieldCreated', 0, 'latest')
    for (let event of events) {
        const [_, addr, name] = event.args
        if (address == addr) {
            return ethers.utils.parseBytes32String(name)
        }
    }
    throw new Error(`cannot find a shield deployed at ${address}`)
}

export async function getShields(
    address: string,
    factory: ethers.Contract
): Promise<string[]> {
    let events = await factory.queryFilter('UserAdded', 0, 'latest')
    const shields = new Set<string>()
    events.forEach(function (event) {
        const [shield, user] = event.args
        if (user === address) {
            shields.add(shield)
        }
    })
    return Array.from(shields)
}

export async function createShield(
    signer: ethers.Signer,
    name: string,
    roles: any[],
    users: any[],
    policy: any[],
    factory: ethers.Contract
): Promise<{ tx: ethers.Transaction; shield: Shield }> {
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
    const tx = await factory
        .connect(signer)
        .createShield(_name, _roles, _users, _policy)
    const receipt = await tx.wait()
    const event = receipt.events.find(
        (event) => event.event === 'ShieldCreated'
    )
    const [_, address] = event?.args
    return { tx, shield: await instantiateShield(signer, address) }
}

export async function instantiateShield(
    signer: ethers.Signer,
    address: string
): Promise<Shield> {
    let contract = new ethers.Contract(address, SHIELD_INTERFACE, signer)
    return new Shield(contract)
}

export class Shield {
    public contract: ethers.Contract
    public abis: { [address: string]: ethers.utils.Interface }

    constructor(contract: ethers.Contract) {
        this.contract = contract
        this.abis = {}
        this.abis[contract.address] = contract.interface
    }

    addInterface(address: string, iface: ethers.utils.Interface) {
        this.abis[address] = iface
    }

    async getRoles(): Promise<string[]> {
        const roles = await this.contract.getRoles()
        return roles.map(ethers.utils.parseBytes32String)
    }

    async createCredentialsForAddRoles(
        signer: ethers.Signer,
        roles: string[]
    ): Promise<Credentials> {
        const newRoles = roles.map(ethers.utils.formatBytes32String)
        return createCredentials(signer, this.contract, 'addRoles', [newRoles])
    }

    async addRoles(
        signer: ethers.Signer,
        roles: string[],
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        const newRoles = roles.map(ethers.utils.formatBytes32String)
        return this.contract.connect(signer).addRoles(newRoles, credentials)
    }

    async getUsers(): Promise<{ [address: string]: string[] }> {
        let events = await this.contract.queryFilter('UserSet', 0, 'latest')
        const roles = await this.contract.getRoles()
        const users = {}
        for (let event of events) {
            const [user, bits] = event.args
            users[user] = getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        }
        return users
    }

    async getUser(address: string): Promise<string[]> {
        const roles = await this.contract.getRoles()
        const bits = await this.contract.getUser(address)
        return getRolesFromBytes(bits, roles).map(
            ethers.utils.parseBytes32String
        )
    }

    async createCredentialsForSetUser(
        signer: ethers.Signer,
        address: any,
        roles: string[]
    ): Promise<Credentials> {
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
    ): Promise<ethers.Transaction> {
        const existingRoles = await this.contract.getRoles()
        const newRoles = getBytesFromRoles(
            roles.map(ethers.utils.formatBytes32String),
            existingRoles
        )
        return this.contract
            .connect(signer)
            .setUser(address, newRoles, credentials)
    }

    async getPolicies(): Promise<{ [label: string]: string[][] }> {
        let events = await this.contract.queryFilter('PolicyAdded', 0, 'latest')
        const roles = await this.contract.getRoles()
        const policies = {}
        for (let event of events) {
            const [label, policy] = event.args
            const decodedLabel = ethers.utils.parseBytes32String(label)
            const decodedPolicy = policy.map(function (bits: any) {
                return getRolesFromBytes(bits, roles).map(
                    ethers.utils.parseBytes32String
                )
            })
            policies[decodedLabel] = decodedPolicy
        }
        return policies
    }

    async getPolicy(label: string): Promise<string[][]> {
        const roles = await this.contract.getRoles()
        const policy = await this.contract.getPolicy(
            ethers.utils.formatBytes32String(label)
        )
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        })
    }

    async createCredentialsForAddPolicy(
        signer: ethers.Signer,
        label: string,
        policy: string[][]
    ): Promise<Credentials> {
        const roles = await this.contract.getRoles()
        const newLabel = ethers.utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(
                step.map(ethers.utils.formatBytes32String),
                roles
            )
        })
        return createCredentials(signer, this.contract, 'addPolicy', [
            newLabel,
            newPolicy,
        ])
    }

    async addPolicy(
        signer: ethers.Signer,
        label: string,
        policy: string[][],
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        const roles = await this.contract.getRoles()
        const newLabel = ethers.utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return getBytesFromRoles(
                step.map(ethers.utils.formatBytes32String),
                roles
            )
        })
        return this.contract
            .connect(signer)
            .addPolicy(newLabel, newPolicy, credentials)
    }

    async getAssignedPolicies(): Promise<{
        [address: string]: { [func: string]: string }
    }> {
        let events = await this.contract.queryFilter(
            'PolicyAssigned',
            0,
            'latest'
        )
        const assignments = {}
        for (let event of events) {
            const [to, sig, label] = event.args
            if (!(to in assignments)) {
                assignments[to] = {}
            }
            const decodedLabel = ethers.utils.parseBytes32String(label)
            const f =
                to in this.abis ? this.abis[to].getFunction(sig).name : sig
            assignments[to][f] = decodedLabel
        }
        return assignments
    }

    async getAssignedPolicy(to: string, func: string): Promise<string> {
        if (!(to in this.abis)) {
            throw new Error(`unknown abi for ${to}`)
        }
        const roles = await this.contract.getRoles()
        let sig = this.abis[to].getSighash(func)
        const policy = await this.contract.getAssignedPolicy(to, sig)
        return policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        })
    }

    async createCredentialsForAssignPolicy(
        signer: ethers.Signer,
        to: string,
        func: string,
        label: string
    ) {
        if (!(to in this.abis)) {
            throw new Error(`unknown abi for ${to}`)
        }
        const sig = this.abis[to].getSighash(func)
        const newLabel = ethers.utils.formatBytes32String(label)
        return createCredentials(signer, this.contract, 'assignPolicy', [
            to,
            sig,
            newLabel,
        ])
    }

    async assignPolicy(
        signer: ethers.Signer,
        to: string,
        func: string,
        label: string,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        if (!(to in this.abis)) {
            throw new Error(`unknown abi for ${to}`)
        }
        const sig = this.abis[to].getSighash(func)
        const newLabel = ethers.utils.formatBytes32String(label)
        return this.contract
            .connect(signer)
            .assignPolicy(to, sig, newLabel, credentials)
    }

    async isPaused(): Promise<boolean> {
        return this.contract.paused()
    }

    async createCredentialsForPause(
        signer: ethers.Signer
    ): Promise<Credentials> {
        return createCredentials(signer, this.contract, 'pause', [])
    }

    async pause(
        signer: ethers.Signer,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        return this.contract.connect(signer).pause(credentials)
    }

    async createCredentialsForUnpause(
        signer: ethers.Signer
    ): Promise<Credentials> {
        return createCredentials(signer, this.contract, 'unpause', [])
    }

    async unpause(
        signer: ethers.Signer,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        return this.contract.connect(signer).unpause(credentials)
    }

    async createCredentialsForTransfer(
        signer: ethers.Signer,
        to: string,
        amount: number
    ): Promise<Credentials> {
        return createCredentials(signer, this.contract, 'transfer', [
            to,
            amount,
        ])
    }

    async transfer(
        signer: ethers.Signer,
        to: string,
        amount: number,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        return this.contract.connect(signer).transfer(to, amount, credentials)
    }

    async burnCredentials(
        signer: ethers.Signer,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        return this.contract.connect(signer).burnCredentials(credentials)
    }

    async checkCredentials(
        credentials: Credentials,
        full?: boolean
    ): Promise<{
        to: string
        func: string
        args: any[]
        timestamp: number
        approvals: string[]
    }> {
        full = typeof full === 'undefined' ? false : full
        const signer = await getSigner(
            ['address', 'bytes', 'uint'],
            [credentials.to, credentials.call, credentials.timestamp],
            credentials.approvals[0]
        )
        let sig = credentials.call.slice(0, 10)
        const signers = await this.contract.validateCredentials(
            credentials,
            signer,
            credentials.to,
            sig,
            credentials.call,
            full
        )
        let func, args
        if (credentials.to in this.abis) {
            func = this.abis[credentials.to].getFunction(sig).name
            args = this.abis[credentials.to].decodeFunctionData(
                sig,
                credentials.call
            )
            args = args.slice(0, -1)
        } else {
            func = sig
            args = [credentials.call.slice(10)]
        }
        return {
            to: credentials.to,
            func,
            args,
            timestamp: credentials.timestamp,
            approvals: signers,
        }
    }
}
