import { Signer, Contract } from "ethers";
export interface Credentials {
    to: string;
    call: string;
    timestamp: number;
    approvals: string[];
}
export declare function createCredentials(signer: Signer, to: Contract, fragment: string, args: any[]): Promise<Credentials>;
export declare function approveCredentials(signer: Signer, credentials: Credentials): Promise<Credentials>;
export declare function encodeCredentials(credentials: Credentials): string;
export declare function decodeCredentials(encodedCredentials: string): Credentials;
export declare function getAllShieldAddresses(signer: Signer): Promise<void>;
export declare function createShield(signer: any, name: any, roles: any, users: any, policy: any, factory?: any, iface?: any): Promise<Shield>;
export declare function createShieldInstance(signer: any, address: any, iface?: any): Promise<Shield>;
export declare class Shield {
    contract: Contract;
    constructor(contract: Contract);
    getRoles(): Promise<any>;
    createCredentialsForAddRoles(signer: any, roles: any): Promise<Credentials>;
    addRoles(signer: any, roles: any, credentials: any): Promise<any>;
    getUsers(): Promise<void>;
    getUser(address: any): Promise<any>;
    createCredentialsForSetUser(signer: any, address: any, roles: any): Promise<Credentials>;
    setUser(signer: any, address: any, roles: any, credentials: any): Promise<any>;
    getPolicys(): Promise<void>;
    getPolicy(label: any): Promise<any>;
    createCredentialsForAddPolicy(signer: any, label: any, policy: any): Promise<Credentials>;
    addPolicy(signer: any, label: any, policy: any, credentials: any): Promise<any>;
    getAssignedPolicies(): Promise<void>;
    getAssignedPolicy(to: any, f: any): Promise<any>;
    createCredentialsForAssignPolicy(signer: any, to: any, f: any, label: any): Promise<Credentials>;
    assignPolicy(signer: any, to: any, f: any, label: any, credentials: any): Promise<any>;
    isPaused(): Promise<any>;
    createCredentialsForPause(signer: any): Promise<Credentials>;
    pause(signer: any, credentials: any): Promise<any>;
    createCredentialsForUnpause(signer: any): Promise<Credentials>;
    unpause(signer: any, credentials: any): Promise<any>;
    validateCredentials(credentials: any): Promise<boolean>;
}
