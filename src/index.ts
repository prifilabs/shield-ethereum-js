import { ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'

import * as Utils from './utils'
export * as Utils from './utils'

import * as Store from './store'
export * as Store from './store'

import { Credentials } from './types'

import {
    getShieldCreated,
    getUsersSet,
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

export async function getShields(
    signer: ethers.Signer,
    factory: ethers.Contract
): Promise<{ [address: string]: string }> {
    let candidates = await getShieldCreated(factory, 0, 'latest')
    let shields = {}
    for (let address in candidates) {
        let contract = new ethers.Contract(address, SHIELD_INTERFACE, signer)
        let roles = await contract.getRoles()
        let users = await getUsersSet(contract, 0, 'latest', roles)
        if ((await signer.getAddress()) in users) {
            shields[address] = candidates[address]
        }
    }
    return shields
}

export async function createShield(
    signer: ethers.Signer,
    name: string,
    roles: any[],
    users: any[],
    policy: any[],
    factory: ethers.Contract,
    storeClass?: Store.StoreClass
): Promise<{ tx: TransactionResponse; shield: Shield }> {
    const _name = ethers.utils.formatBytes32String(name)
    const _roles = roles.map(ethers.utils.formatBytes32String)
    const _users = users.map(function (user: { roles: string[]; addr: any }) {
        const rolesAssigned = user.roles.map(ethers.utils.formatBytes32String)
        return {
            addr: user.addr,
            roles: Utils.getBytesFromRoles(rolesAssigned, _roles),
        }
    })
    const _policy = policy.map(function (step: string[]) {
        const rolesAssigned = step.map(ethers.utils.formatBytes32String)
        return Utils.getBytesFromRoles(rolesAssigned, _roles)
    })
    const tx = await factory
        .connect(signer)
        .createShield(_name, _roles, _users, _policy)
    const receipt = await tx.wait()
    const event = receipt.events.find(
        (event) => event.event === 'ShieldCreated'
    )
    const [_, address] = event?.args
    const shield = await instantiateShield(signer, address, storeClass)
    await shield.addInterface(shield.contract.address, SHIELD_INTERFACE)
    return { tx, shield }
}

export async function instantiateShield(
    signer: ethers.Signer,
    address: string,
    storeClass?: Store.StoreClass
): Promise<Shield> {
    let contract = new ethers.Contract(address, SHIELD_INTERFACE, signer)
    const shield = new Shield(signer, contract)
    await shield.initStorage(storeClass)
    return shield
}

export class Shield {
    public signer: ethers.Signer
    public contract: ethers.Contract
    public store: Store.IStore

    constructor(signer: ethers.Signer, contract: ethers.Contract) {
        this.signer = signer
        this.contract = contract
    }

    async initStorage(storeClass?: Store.StoreClass) {
        const network = (await this.contract.provider.getNetwork()).name
        if (typeof storeClass === 'undefined') {
            if (network in CONFIG) {
                storeClass = Store.getServerStore
            } else {
                storeClass = Store.getMemoryStore
            }
        }
        this.store = storeClass(network, this.contract.address)
    }

    async addInterface(address: string, iface: ethers.utils.Interface) {
        return this.store.addInterface(address, iface)
    }

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        return this.store.getInterface(address)
    }

    async getRoles(): Promise<string[]> {
        const roles = await this.contract.getRoles()
        return roles.map(ethers.utils.parseBytes32String)
    }

    async createCredentialsForAddRoles(roles: string[]): Promise<Credentials> {
        const newRoles = roles.map(ethers.utils.formatBytes32String)
        return this.createCredentials(this.contract.address, 'addRoles', [
            newRoles,
        ])
    }

    async getUsers(): Promise<{ [address: string]: string[] }> {
        const roles = await this.contract.getRoles()
        return getUsersSet(this.contract, 0, 'latest', roles)
    }

    async getUser(address: string): Promise<string[]> {
        const roles = await this.contract.getRoles()
        const bits = await this.contract.getUser(address)
        return Utils.getRolesFromBytes(bits, roles).map(
            ethers.utils.parseBytes32String
        )
    }

    async createCredentialsForSetUsers(
        users: Array<{ address: string; roles: string[] }>
    ): Promise<Credentials> {
        const existingRoles = await this.contract.getRoles()
        const newUsers = []
        for (let user of users) {
            const newRoles = Utils.getBytesFromRoles(
                user.roles.map(ethers.utils.formatBytes32String),
                existingRoles
            )
            newUsers.push({ addr: user.address, roles: newRoles })
        }
        return this.createCredentials(this.contract.address, 'setUsers', [
            newUsers,
        ])
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
            return Utils.getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        })
    }

    async createCredentialsForAddPolicy(
        label: string,
        policy: string[][]
    ): Promise<Credentials> {
        const roles = await this.contract.getRoles()
        const newLabel = ethers.utils.formatBytes32String(label)
        const newPolicy = policy.map(function (step: string[]) {
            return Utils.getBytesFromRoles(
                step.map(ethers.utils.formatBytes32String),
                roles
            )
        })
        return this.createCredentials(this.contract.address, 'addPolicy', [
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
                const iface = await this.getInterface(address)
                const func = Utils.getFunction(sig, iface)
                assignments[address][func] = addresses[address][sig]
            }
        }
        return assignments
    }

    async getAssignedPolicy(to: string, func: string): Promise<string> {
        const roles = await this.contract.getRoles()
        const iface = await this.getInterface(to)
        const sig = Utils.getSignature(func, iface)
        const policy = await this.contract.getAssignedPolicy(to, sig)
        return policy.map(function (bits: any) {
            return Utils.getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        })
    }

    async createCredentialsForAssignPolicy(
        to: string,
        func: string,
        label: string
    ) {
        const iface = await this.getInterface(to)
        const sig = Utils.getSignature(func, iface)
        const newLabel = ethers.utils.formatBytes32String(label)
        return this.createCredentials(this.contract.address, 'assignPolicy', [
            to,
            sig,
            newLabel,
        ])
    }

    async isPaused(): Promise<boolean> {
        return this.contract.paused()
    }

    async createCredentialsForPause(): Promise<Credentials> {
        return this.createCredentials(this.contract.address, 'pause', [])
    }

    async createCredentialsForUnpause(): Promise<Credentials> {
        return this.createCredentials(this.contract.address, 'unpause', [])
    }

    async createCredentialsForTransfer(
        to: string,
        amount: number
    ): Promise<Credentials> {
        return this.createCredentials(this.contract.address, 'transfer', [
            to,
            amount,
        ])
    }

    async canApprove(to: string, func: string, index?: number) {
        index = typeof index === 'undefined' ? 0 : index
        const iface = await this.getInterface(to)
        const sig = Utils.getSignature(func, iface)
        const policy = await this.contract.getAssignedPolicy(to, sig)
        return this.contract.hasAnyRoles(
            await this.signer.getAddress(),
            policy[index]
        )
    }

    async getCredentials(): Promise<Array<Credentials>> {
        return this.store.getCredentials()
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
        const signer = await Utils.getSigner(
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
        const iface = await this.getInterface(credentials.to)
        const { func, args } = Utils.decodeCallData(credentials.call, iface)
        return {
            chainid: credentials.chainid,
            timestamp: credentials.timestamp,
            to: credentials.to,
            func,
            args,
            approvals: signers,
        }
    }

    async createCredentials(
        to: string,
        func: string,
        args: any[]
    ): Promise<Credentials> {
        if (!(await this.canApprove(to, func))) {
            throw new Error('Signer cannot create such credentials')
        }
        const chainid = await this.signer.getChainId()
        const timestamp = Math.floor(new Date().getTime())
        const iface = await this.getInterface(to)
        const call = Utils.encodeCallData(func, args, iface)
        const signature = await Utils.signData(
            this.signer,
            ['uint', 'uint', 'address', 'bytes'],
            [timestamp, chainid, to, call]
        )
        const credentials = {
            timestamp,
            chainid,
            to,
            call,
            approvals: [signature],
        }
        await this.store.addCredentials(credentials)
        return credentials
    }

    async approveCredentials(credentials: Credentials): Promise<Credentials> {
        const iface = await this.getInterface(credentials.to)
        const { func } = Utils.decodeCallData(credentials.call, iface)
        if (
            !(await this.canApprove(
                credentials.to,
                func,
                credentials.approvals.length
            ))
        ) {
            throw new Error('Signer cannot approve the credentials')
        }
        const { timestamp, chainid, to, call, approvals } = credentials
        const lastSignature = approvals[approvals.length - 1]
        const signature = await Utils.signData(
            this.signer,
            ['bytes'],
            [lastSignature]
        )
        const newCredentials = {
            timestamp,
            chainid,
            to,
            call,
            approvals: [...approvals, signature],
        }
        await this.store.addCredentials(newCredentials)
        return newCredentials
    }

    async executeCredentials(
        credentials: Credentials,
        options?
    ): Promise<TransactionResponse> {
        if (typeof options === 'undefined') {
            options = {}
        }
        const { approvals } = await this.checkCredentials(credentials, true)
        if (approvals.indexOf(await this.signer.getAddress()) == -1) {
            throw new Error(`signer is not one of the approvers`)
        }
        const iface = await this.getInterface(credentials.to)
        const contract = new ethers.Contract(credentials.to, iface, this.signer)
        const { func, args } = Utils.decodeCallData(credentials.call, iface)
        return contract[func].apply(this, [...args, credentials], options)
    }

    async cancelCredentials(
        credentials: Credentials
    ): Promise<TransactionResponse> {
        return this.contract.connect(this.signer).cancelCredentials(credentials)
    }

    async isCanceled(credentials: Credentials): Promise<boolean> {
        const iface = await this.getInterface(credentials.to)
        const contract = new ethers.Contract(credentials.to, iface, this.signer)
        return contract.canceled(
            ethers.utils.keccak256(credentials.approvals[0])
        )
    }

    async isExecuted(credentials: Credentials): Promise<boolean> {
        const iface = await this.getInterface(credentials.to)
        const contract = new ethers.Contract(credentials.to, iface, this.signer)
        return contract.executed(
            ethers.utils.keccak256(credentials.approvals[0])
        )
    }
}
