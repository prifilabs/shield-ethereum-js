import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer, Contract, utils, ContractInterface } from 'ethers';
import { Credentials } from './types';
export declare function createCredentials(signer: Signer, to: Contract, fragment: string, args: any[]): Promise<Credentials>;
export declare function approveCredentials(signer: Signer, credentials: Credentials): Promise<Credentials>;
export declare function encodeCredentials(credentials: Credentials): string;
export declare function decodeCredentials(encodedCredentials: string): Credentials;
export declare function getAllShieldAddresses(signer: Signer): Promise<void>;
export declare function createShield(signer: SignerWithAddress, name: string, roles: any[], users: any[], policy: any[], factory?: Contract, iface?: utils.Interface): Promise<Shield>;
export declare function createShieldInstance(signer: Signer | Provider, address: string, iface?: ContractInterface): Promise<Shield>;
export declare class Shield {
    contract: Contract;
    constructor(contract: Contract);
    getRoles(): Promise<any>;
    createCredentialsForAddRoles(signer: Signer, roles: string[]): Promise<Credentials>;
    addRoles(signer: string | Signer | Provider, roles: string[], credentials: any): Promise<any>;
    getUsers(): Promise<void>;
    getUser(address: any): Promise<string[]>;
    createCredentialsForSetUser(signer: Signer, address: any, roles: string[]): Promise<Credentials>;
    setUser(signer: string | Signer | Provider, address: any, roles: string[], credentials: any): Promise<any>;
    getPolicys(): Promise<void>;
    getPolicy(label: string): Promise<any>;
    createCredentialsForAddPolicy(signer: Signer, label: string, policy: any[]): Promise<Credentials>;
    addPolicy(signer: string | Signer | Provider, label: string, policy: any[], credentials: any): Promise<any>;
    getAssignedPolicies(): Promise<void>;
    getAssignedPolicy(to: {
        interface: {
            getSighash: (arg0: any) => any;
        };
        address: any;
    }, f: any): Promise<any>;
    createCredentialsForAssignPolicy(signer: Signer, to: {
        interface: {
            getSighash: (arg0: any) => any;
        };
        address: any;
    }, f: any, label: string): Promise<Credentials>;
    assignPolicy(signer: string | Signer | Provider, to: {
        interface: {
            getSighash: (arg0: any) => any;
        };
        address: any;
    }, f: any, label: string, credentials: any): Promise<any>;
    isPaused(): Promise<any>;
    createCredentialsForPause(signer: Signer): Promise<Credentials>;
    pause(signer: string | Signer | Provider, credentials: any): Promise<any>;
    createCredentialsForUnpause(signer: Signer): Promise<Credentials>;
    unpause(signer: string | Signer | Provider, credentials: any): Promise<any>;
    createCredentialsForTransfer(signer: Signer, to: string, amount: number): Promise<Credentials>;
    transfer(signer: string | Signer | Provider, to: string, amount: number, credentials: any): Promise<any>;
    burnCredentials(signer: string | Signer | Provider, credentials: any): Promise<any>;
    validateCredentials(credentials: {
        to: any;
        call: string | any[];
        timestamp: any;
        approvals: string[];
        signer: any;
    }, full: boolean): Promise<string[]>;
}
