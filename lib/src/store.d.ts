import { ethers } from 'ethers';
import { Credentials } from './types';
export interface IStore {
    addInterface: (address: string, iface: ethers.utils.Interface) => Promise<void>;
    getInterface: (address: string) => Promise<ethers.utils.Interface>;
    addCredentials: (credentials: Credentials) => Promise<void>;
    getCredentials: () => Promise<Array<Credentials>>;
}
export declare class MemoryStore implements IStore {
    static credentials: {
        [approval: string]: Credentials;
    };
    static interfaces: {
        [address: string]: ethers.utils.Interface;
    };
    constructor();
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
}
export declare class ServerStore implements IStore {
    private network;
    private shield;
    constructor(network: string, shield: string);
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
}
