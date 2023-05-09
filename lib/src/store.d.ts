import { ethers } from 'ethers';
import { Credentials } from './types';
export interface IStore {
    addShieldable: (address: string, iface: ethers.utils.Interface) => Promise<void>;
    getShieldables: () => Promise<Array<string>>;
    getInterface: (address: string) => Promise<ethers.utils.Interface>;
    addCredentials: (credentials: Credentials) => Promise<void>;
    getCredentials: () => Promise<Array<Credentials>>;
    addTransaction: (credentials: Credentials, hash: string) => Promise<void>;
    getTransaction: (credentials: Credentials) => Promise<string>;
}
export type StoreClass = (network: string, shield: string) => IStore;
export declare const getMemoryStore: StoreClass;
export declare const getServerStore: StoreClass;
export declare class MemoryStore implements IStore {
    private key;
    static shields: {};
    constructor(network: string, shield: string);
    addShieldable(address: string, iface: ethers.utils.Interface): Promise<void>;
    getShieldables(): Promise<Array<string>>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
    addTransaction(credentials: Credentials, hash: string): Promise<void>;
    getTransaction(credentials: Credentials): Promise<string>;
}
export declare class ServerStore implements IStore {
    private shieldablesCache;
    private transactionCache;
    private static server;
    private url;
    static setServer(server: string): void;
    constructor(network: string, shield: string);
    addShieldable(address: string, iface: ethers.utils.Interface): Promise<void>;
    getShieldables(): Promise<Array<string>>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    addCredentials(credentials: Credentials): Promise<void>;
    getCredentials(): Promise<Array<Credentials>>;
    addTransaction(credentials: Credentials, hash: string): Promise<void>;
    getTransaction(credentials: Credentials): Promise<string>;
}
