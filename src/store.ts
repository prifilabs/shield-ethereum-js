import fetch from 'cross-fetch'

import { ethers } from 'ethers'

import { Credentials } from './types'
import * as Utils from './utils'

export interface IStore {
    addInterface: (
        address: string,
        iface: ethers.utils.Interface
    ) => Promise<void>
    getInterface: (address: string) => Promise<ethers.utils.Interface>
    addCredentials: (credentials: Credentials) => Promise<void>
    getCredentials: () => Promise<Array<Credentials>>
    addTransaction: (credentials: Credentials, hash: string) => Promise<void>
    getTransaction: (credentials: Credentials) => Promise<string>
}

export type StoreClass = (network: string, shield: string) => IStore

export const getMemoryStore: StoreClass = function (network, shield) {
    return new MemoryStore(network, shield) as IStore
}

export const getServerStore: StoreClass = function (network, shield) {
    return new ServerStore(network, shield) as IStore
}

export class MemoryStore implements IStore {
    private key
    static shields = {}

    constructor(network: string, shield: string) {
        this.key = shield + '@' + network
        if (!(this.key in MemoryStore.shields)) {
            MemoryStore.shields[this.key] = {
                interfaces: {},
                credentials: {},
                transactions: {},
            }
        }
    }

    async addInterface(address: string, iface: ethers.utils.Interface) {
        MemoryStore.shields[this.key].interfaces[address] = iface
    }

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        if (!(address in MemoryStore.shields[this.key].interfaces)) {
            throw new Error(`no interface for ${address}`)
        }
        return MemoryStore.shields[this.key].interfaces[address]
    }

    async addCredentials(credentials: Credentials) {
        MemoryStore.shields[this.key].credentials[credentials.approvals[0]] =
            credentials
    }

    async getCredentials(): Promise<Array<Credentials>> {
        return Object.values(MemoryStore.shields[this.key].credentials)
    }

    async addTransaction(credentials: Credentials, hash: string) {
        MemoryStore.shields[this.key].transactions[credentials.approvals[0]] =
            hash
    }

    async getTransaction(credentials: Credentials): Promise<string> {
        return MemoryStore.shields[this.key].transactions[
            credentials.approvals[0]
        ]
    }
}

export class ServerStore implements IStore {
    private shieldablesCache: { [address: string]: ethers.utils.Interface }
    private transactionCache: { [approver: string]: string }
    private static server = 'https://shield-backend.prifilabs.com'
    private url: string

    static setServer(server: string) {
        ServerStore.server = server
    }

    constructor(network: string, shield: string) {
        this.url = `${ServerStore.server}/${network}/${shield}`
        this.shieldablesCache = {}
        this.transactionCache = {}
    }

    async addInterface(address: string, iface: ethers.utils.Interface) {
        await fetch(`${this.url}/interfaces/${address}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                interface: iface.format(ethers.utils.FormatTypes.full),
            }),
        })
        this.shieldablesCache[address] = iface
    }

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        if (address in this.shieldablesCache) {
            return this.shieldablesCache[address]
        }
        const response = await fetch(`${this.url}/interfaces/${address}/`)
        const data = await response.json()
        const iface = new ethers.utils.Interface(data.interface)
        this.shieldablesCache[address] = iface
        return iface
    }

    async addCredentials(credentials: Credentials) {
        await fetch(`${this.url}/credentials/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                credentials: Utils.encodeCredentials(credentials),
            }),
        })
    }

    async getCredentials(): Promise<Array<Credentials>> {
        const response = await fetch(`${this.url}/credentials/`)
        const data = await response.json()
        return data.map(function (credentials) {
            return Utils.decodeCredentials(credentials)
        })
    }

    async addTransaction(credentials: Credentials, hash: string) {
        const approver = btoa(credentials.approvals[0])
        await fetch(`${this.url}/credentials/${approver}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tx: hash,
            }),
        })
        this.transactionCache[approver] = hash
    }

    async getTransaction(credentials: Credentials): Promise<string> {
        const approver = btoa(credentials.approvals[0])
        if (approver in this.transactionCache) {
            return this.transactionCache[approver]
        }
        const response = await fetch(`${this.url}/credentials/${approver}/`)
        const data = await response.json()
        const tx = data.tx
        this.transactionCache[approver] = tx
        return tx
    }
}
