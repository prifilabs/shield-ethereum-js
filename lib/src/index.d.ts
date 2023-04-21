import { ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
export * as Utils from './utils';
import * as Store from './store';
export * as Store from './store';
import { Credentials } from './types';
export declare function getDefaultFactory(signer: ethers.Signer, network: string): Promise<ethers.Contract>;
export declare function getShields(signer: ethers.Signer, factory: ethers.Contract): Promise<{
    [address: string]: string;
}>;
export declare function createShield(signer: ethers.Signer, name: string, roles: any[], users: any[], policy: any[], factory: ethers.Contract, storeClass?: Store.StoreClass): Promise<{
    tx: TransactionResponse;
    shield: Shield;
}>;
export declare function instantiateShield(signer: ethers.Signer, address: string, storeClass?: Store.StoreClass): Promise<Shield>;
export declare class Shield {
    signer: ethers.Signer;
    contract: ethers.Contract;
    store: Store.IStore;
    constructor(signer: ethers.Signer, contract: ethers.Contract);
    initStorage(storeClass?: Store.StoreClass): Promise<void>;
    addInterface(address: string, iface: ethers.utils.Interface): Promise<void>;
    getInterface(address: string): Promise<ethers.utils.Interface>;
    getShieldables(): Promise<Array<string>>;
    getRoles(): Promise<string[]>;
    createCredentialsForAddRoles(roles: string[]): Promise<Credentials>;
    getUsers(): Promise<{
        [address: string]: string[];
    }>;
    getUser(address: string): Promise<string[]>;
    createCredentialsForSetUsers(users: Array<{
        address: string;
        roles: string[];
    }>): Promise<Credentials>;
    getPolicies(): Promise<{
        [label: string]: string[][];
    }>;
    getPolicy(label: string): Promise<string[][]>;
    createCredentialsForAddPolicy(label: string, policy: string[][]): Promise<Credentials>;
    getAssignedPolicies(): Promise<{
        [address: string]: {
            [func: string]: string;
        };
    }>;
    getAssignedPolicy(to: string, func: string): Promise<string>;
    createCredentialsForAssignPolicy(to: string, func: string, label: string): Promise<Credentials>;
    isPaused(): Promise<boolean>;
    createCredentialsForPause(): Promise<Credentials>;
    createCredentialsForUnpause(): Promise<Credentials>;
    createCredentialsForTransfer(to: string, amount: number): Promise<Credentials>;
    canApprove(to: string, func: string, index?: number): Promise<any>;
    getCredentials(): Promise<Array<Credentials>>;
    checkCredentials(credentials: Credentials, full?: boolean): Promise<{
        chainid: number;
        timestamp: number;
        to: string;
        func: string;
        args: any[];
        approvals: string[];
    }>;
    createCredentials(to: string, func: string, args: any[]): Promise<Credentials>;
    approveCredentials(credentials: Credentials): Promise<Credentials>;
    executeCredentials(credentials: Credentials, options?: any): Promise<TransactionResponse>;
    cancelCredentials(credentials: Credentials): Promise<TransactionResponse>;
    isCanceled(credentials: Credentials): Promise<boolean>;
    isExecuted(credentials: Credentials): Promise<boolean>;
}
