import { ethers } from 'ethers';
import { Credentials } from './types';
export interface IStore {
    addInterface: (address: string, iface: ethers.utils.Interface) => Promise<void>;
    getInterface: (address: string) => Promise<ethers.utils.Interface>;
    addCredentials: (credentials: Credentials) => Promise<void>;
    getCredentials: () => Promise<Array<Credentials>>;
}
export type StoreClass = (network: string, shield: string) => IStore;
export declare const getMemoryStore: StoreClass;
export declare const getServerStore: StoreClass;
export declare class MemoryStore implements IStore {
    static credentials: {
        [approval: string]: Credentials;
    };
    static interfaces: {
        [address: string]: ethers.utils.Interface;
    };
    constructor(network: string, shield: string);
    static setServer(server: string): void;
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
}
export declare class ServerStore implements IStore {
    private cache;
    private static server;
    private url;
    static setServer(server: string): void;
    constructor(network: string, shield: string);
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
}
