import { ethers } from 'ethers'
import {
    getBytesFromRoles,
    getRolesFromBytes,
    signData,
    getSigner,
    decodeCallData,
    encodeCallData,
} from './utils'
import { Credentials } from './types'

import {
    getShieldCreated,
    getUserSet,
    getPolicyAdded,
    getPolicyAssigned,
} from './events'

import CONFIG from './config.json'
import SHIELD from '../artifacts/contracts/Shield.sol/Shield.json'
import FACTORY from '../artifacts/contracts/ShieldFactory.sol/ShieldFactory.json'

const SHIELD_INTERFACE = new ethers.utils.Interface(SHIELD.abi)

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
    const chainid = await signer.getChainId()
    const call = encodeCallData(func, args, to.interface)
    const timestamp = Math.floor(new Date().getTime())
    const signature = await signData(
        signer,
        ['uint', 'uint', 'address', 'bytes'],
        [timestamp, chainid, to.address, call]
    )
    return { timestamp, chainid, to: to.address, call, approvals: [signature] }
}

export async function approveCredentials(
    signer: ethers.Signer,
    credentials: Credentials
): Promise<Credentials> {
    const { timestamp, chainid, to, call, approvals } = credentials
    const lastSignature = approvals[approvals.length - 1]
    const signature = await signData(signer, ['bytes'], [lastSignature])
    return {
        timestamp,
        chainid,
        to,
        call,
        approvals: [...approvals, signature],
    }
}

export function encodeCredentials(credentials: Credentials): string {
    const { timestamp, chainid, to, call, approvals } = credentials

    return btoa(
        JSON.stringify({
            timestamp,
            chainid,
            to,
            call,
            approvals: approvals.map(btoa),
        })
    )
}

export function decodeCredentials(encodedCredentials: string): Credentials {
    const { timestamp, chainid, to, call, approvals } = JSON.parse(
        atob(encodedCredentials)
    )
    return { timestamp, chainid, to, call, approvals: approvals.map(atob) }
}

export function executeCredentials(
    signer: ethers.Signer,
    credentials: Credentials,
    iface: ethers.utils.Interface,
    options?
): Promise<ethers.Transaction> {
    if (typeof options === 'undefined') {
        options = {}
    }
    const contract = new ethers.Contract(credentials.to, iface, signer)
    const { func, args } = decodeCallData(credentials.call, iface)
    return contract[func].apply(this, [...args, credentials], options)
}

export async function getShieldName(
    address: string,
    factory: ethers.Contract
): Promise<string> {
    let shields = await getShieldCreated(factory, 0, 'latest')
    if (!(address in shields)) {
        throw new Error(`cannot find a shield deployed at ${address}`)
    }
    return shields[address]
}

export async function getShields(
    signer: ethers.Signer,
    factory: ethers.Contract
): Promise<string[]> {
    let shields = await getShieldCreated(factory, 0, 'latest')
    return Object.keys(shields).filter(async function (shield) {
        let contract = new ethers.Contract(shield, SHIELD_INTERFACE, signer)
        let roles = await contract.getRoles()
        let users = await getUserSet(contract, 0, 'latest', roles)
        return (await signer.getAddress()) in users
    })
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

    async getUsers(): Promise<{ [address: string]: string[] }> {
        const roles = await this.contract.getRoles()
        return getUserSet(this.contract, 0, 'latest', roles)
    }

    async getUser(address: string): Promise<string[]> {
        const roles = await this.contract.getRoles()
        const bits = await this.contract.getUser(address)
        return getRolesFromBytes(bits, roles).map(
            ethers.utils.parseBytes32String
        )
    }

    async createCredentialsForSetUsers(
        signer: ethers.Signer,
        users: Array<{ address: string; roles: string[] }>
    ): Promise<Credentials> {
        const existingRoles = await this.contract.getRoles()
        const newUsers = []
        for (let user of users) {
            const newRoles = getBytesFromRoles(
                user.roles.map(ethers.utils.formatBytes32String),
                existingRoles
            )
            newUsers.push({ addr: user.address, roles: newRoles })
        }
        return createCredentials(signer, this.contract, 'setUsers', [newUsers])
    }

    async getPolicies(): Promise<{ [label: string]: string[][] }> {
        const roles = await this.contract.getRoles()
        return getPolicyAdded(this.contract, 0, 'latest', roles)
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

    async getAssignedPolicies(): Promise<{
        [address: string]: { [func: string]: string }
    }> {
        const addresses = await getPolicyAssigned(this.contract, 0, 'latest')
        const assignments = {}
        for (let address in addresses) {
            assignments[address] = {}
            for (let sig in addresses[address]) {
                const f =
                    address in this.abis
                        ? this.abis[address].getFunction(sig).name
                        : sig
                assignments[address][f] = addresses[address][sig]
            }
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

    async isPaused(): Promise<boolean> {
        return this.contract.paused()
    }

    async createCredentialsForPause(
        signer: ethers.Signer
    ): Promise<Credentials> {
        return createCredentials(signer, this.contract, 'pause', [])
    }

    async createCredentialsForUnpause(
        signer: ethers.Signer
    ): Promise<Credentials> {
        return createCredentials(signer, this.contract, 'unpause', [])
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
        chainid: number
        timestamp: number
        to: string
        func: string
        args: any[]
        approvals: string[]
    }> {
        full = typeof full === 'undefined' ? false : full
        const signer = await getSigner(
            ['uint', 'uint', 'address', 'bytes'],
            [
                credentials.timestamp,
                credentials.chainid,
                credentials.to,
                credentials.call,
            ],
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
        const { func, args } =
            credentials.to in this.abis
                ? decodeCallData(credentials.call, this.abis[credentials.to])
                : { func: sig, args: [credentials.call.slice(10)] }
        return {
            chainid: credentials.chainid,
            timestamp: credentials.timestamp,
            to: credentials.to,
            func,
            args,
            approvals: signers,
        }
    }

    async executeCredentials(
        signer: ethers.Signer,
        credentials: Credentials
    ): Promise<ethers.Transaction> {
        return executeCredentials(signer, credentials, this.contract.interface)
    }

    async isBurnt(
        signer: ethers.Signer,
        credentials: Credentials
    ): Promise<boolean> {
        const contract = new ethers.Contract(
            credentials.to,
            this.abis[credentials.to],
            signer
        )
        return contract.burns(ethers.utils.keccak256(credentials.approvals[0]))
    }
}
