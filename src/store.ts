import { ethers } from 'ethers'
import { Credentials } from './types'

export interface IStore {
    addInterface: (
        address: string,
        iface: ethers.utils.Interface
    ) => Promise<void>
    getInterface: (address: string) => Promise<ethers.utils.Interface>
    addCredentials: (credentials: Credentials) => Promise<void>
    getCredentials: () => Promise<Array<Credentials>>
}

export class MemoryStore implements IStore {
    static credentials: { [approval: string]: Credentials } = {}
    static interfaces: { [address: string]: ethers.utils.Interface } = {}

    constructor() {}

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

export class ServerStore implements IStore {
    private network: string
    private shield: string

    constructor(network: string, shield: string) {
        this.network = network
        this.shield = shield
    }

    async addInterface(address: string, iface: ethers.utils.Interface) {}

    async getInterface(address: string): Promise<ethers.utils.Interface> {
        return new ethers.utils.Interface([])
    }

    async addCredentials(credentials: Credentials) {}

    async getCredentials(): Promise<Array<Credentials>> {
        return []
    }
}
