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
export declare function createShield(signer: any, name: any, roles: any, users: any, policy: any, factory?: any, shield?: any): Promise<Shield>;
export declare function createShieldInstance(signer: any, address: any, shield?: any): Promise<Shield>;
export declare class Shield {
    contract: Contract;
    signer: Signer;
    constructor(contract: Contract, signer: Signer);
    getRoles(): Promise<any>;
    createCredentialsForAddRoles(roles: any): Promise<Credentials>;
    addRoles(roles: any, credentials: any): Promise<any>;
    getUsers(): Promise<void>;
    getUser(address: any): Promise<any>;
    createCredentialsForSetUser(address: any, roles: any): Promise<Credentials>;
    setUser(address: any, roles: any, credentials: any): Promise<any>;
    getRules(): Promise<void>;
    getRule(label: any): Promise<any>;
    createCredentialsForAddRule(label: any, policy: any): Promise<Credentials>;
    addRule(label: any, policy: any, credentials: any): Promise<any>;
    getAssignments(): Promise<void>;
    getAssignment(to: any, f: any): Promise<any>;
    createCredentialsForAssignRule(to: any, f: any, label: any): Promise<Credentials>;
    assignRule(to: any, f: any, label: any, credentials: any): Promise<any>;
    isPaused(): Promise<any>;
    createCredentialsForPause(): Promise<Credentials>;
    pause(credentials: any): Promise<any>;
    createCredentialsForUnpause(): Promise<Credentials>;
    unpause(credentials: any): Promise<any>;
    validateCredentials(credentials: any): Promise<boolean>;
}
