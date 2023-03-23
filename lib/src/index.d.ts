import { ethers } from 'ethers';
import { Credentials } from './types';
export declare function getDefaultFactory(signer: ethers.Signer, network: string): Promise<ethers.Contract>;
export declare function createCredentials(signer: ethers.Signer, to: ethers.Contract, func: string, args: any[]): Promise<Credentials>;
export declare function approveCredentials(signer: ethers.Signer, credentials: Credentials): Promise<Credentials>;
export declare function encodeCredentials(credentials: Credentials): string;
export declare function decodeCredentials(encodedCredentials: string): Credentials;
export declare function getShields(provider: any, address: string, factory: ethers.Contract): Promise<string[]>;
export declare function createShield(signer: ethers.Signer, name: string, roles: any[], users: any[], policy: any[], factory: ethers.Contract): Promise<{
    tx: ethers.Transaction;
    shield: Shield;
}>;
export declare function instantiateShield(signer: ethers.Signer, address: string): Promise<Shield>;
export declare class Shield {
    contract: ethers.Contract;
    abis: {
        [address: string]: ethers.utils.Interface;
    };
    constructor(contract: ethers.Contract);
    addInterface(address: string, iface: ethers.utils.Interface): void;
    getRoles(): Promise<string[]>;
    createCredentialsForAddRoles(signer: ethers.Signer, roles: string[]): Promise<Credentials>;
    addRoles(signer: ethers.Signer, roles: string[], credentials: Credentials): Promise<ethers.Transaction>;
    getUsers(provider: any): Promise<{
        [address: string]: string[];
    }>;
    getUser(address: string): Promise<string[]>;
    createCredentialsForSetUser(signer: ethers.Signer, address: any, roles: string[]): Promise<Credentials>;
    setUser(signer: ethers.Signer, address: any, roles: string[], credentials: Credentials): Promise<ethers.Transaction>;
    getPolicies(provider: any): Promise<{
        [label: string]: string[][];
    }>;
    getPolicy(label: string): Promise<string[][]>;
    createCredentialsForAddPolicy(signer: ethers.Signer, label: string, policy: string[][]): Promise<Credentials>;
    addPolicy(signer: ethers.Signer, label: string, policy: string[][], credentials: Credentials): Promise<ethers.Transaction>;
    getAssignedPolicies(provider: any): Promise<{
        [address: string]: {
            [func: string]: string;
        };
    }>;
    getAssignedPolicy(to: string, func: string): Promise<string>;
    createCredentialsForAssignPolicy(signer: ethers.Signer, to: string, func: string, label: string): Promise<Credentials>;
    assignPolicy(signer: ethers.Signer, to: string, func: string, label: string, credentials: Credentials): Promise<ethers.Transaction>;
    isPaused(): Promise<boolean>;
    createCredentialsForPause(signer: ethers.Signer): Promise<Credentials>;
    pause(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>;
    createCredentialsForUnpause(signer: ethers.Signer): Promise<Credentials>;
    unpause(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>;
    createCredentialsForTransfer(signer: ethers.Signer, to: string, amount: number): Promise<Credentials>;
    transfer(signer: ethers.Signer, to: string, amount: number, credentials: Credentials): Promise<ethers.Transaction>;
    burnCredentials(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>;
    checkCredentials(credentials: Credentials, full?: boolean): Promise<{
        to: string;
        func: string;
        args: any[];
        timestamp: number;
        approvals: string[];
    }>;
}
