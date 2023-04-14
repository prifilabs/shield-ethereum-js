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
}

export type StoreClass = (network: string, shield: string) => IStore

export const getMemoryStore: StoreClass = function (network, shield) {
    return new MemoryStore(network, shield) as IStore
}

export const getServerStore: StoreClass = function (network, shield) {
    return new ServerStore(network, shield) as IStore
}

export class MemoryStore implements IStore {
    static credentials: { [approval: string]: Credentials } = {}
    static interfaces: { [address: string]: ethers.utils.Interface } = {}

    constructor(network: string, shield: string) {}

    static setServer(server: string) {}

    async addInterface(address: string, iface: ethers.utils.Interface) {
        MemoryStore.interfaces[address] = iface
    }

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        if (!(address in MemoryStore.interfaces)) {
            throw new Error(`no interface for ${address}`)
        }
        return MemoryStore.interfaces[address]
    }

    async addCredentials(credentials: Credentials) {
        MemoryStore.credentials[credentials.approvals[0]] = credentials
    }

    async getCredentials(): Promise<Array<Credentials>> {
        return Object.values(MemoryStore.credentials)
    }
}

import axios, { isCancel, AxiosError } from 'axios'

export class ServerStore implements IStore {
    private cache: { [address: string]: ethers.utils.Interface } = {}
    private static server = 'https://shield-backend.prifilabs.com'
    private url: string

    static setServer(server: string) {
        ServerStore.server = server
    }

    constructor(network: string, shield: string) {
        this.url = `${ServerStore.server}/${network}/${shield}`
        this.cache = {}
    }

    async addInterface(address: string, iface: ethers.utils.Interface) {
        await axios.put(`${this.url}/interfaces/${address}/`, {
            interface: iface.format(ethers.utils.FormatTypes.full),
        })
        this.cache[address] = iface
    }

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        if (address in this.cache) {
            return this.cache[address]
        }
        const response = await axios.get(`${this.url}/interfaces/${address}/`)
        return new ethers.utils.Interface(response.data.interface)
    }

    async addCredentials(credentials: Credentials) {
        await axios.post(`${this.url}/credentials/`, {
            credentials: Utils.encodeCredentials(credentials),
        })
    }

    async getCredentials(): Promise<Array<Credentials>> {
        const response = await axios.get(`${this.url}/credentials/`)
        return response.data.map(function (credentials) {
            return Utils.decodeCredentials(credentials)
        })
    }
}
