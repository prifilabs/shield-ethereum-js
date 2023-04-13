import { ethers } from 'ethers';
import { Credentials } from './types';
export interface IStorage {
    addInterface: (address: string, iface: ethers.utils.Interface) => Promise<void>;
    getInterface: (address: string) => Promise<ethers.utils.Interface>;
    addCredentials: (credentials: Credentials) => Promise<void>;
    getCredentials: () => Promise<Array<Credentials>>;
}
export declare class MemoryStorage implements IStorage {
    private credentials;
    private interfaces;
    constructor();
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
}
