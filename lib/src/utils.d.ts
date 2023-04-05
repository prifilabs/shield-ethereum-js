import { Signer } from 'ethers';
export declare function signData(signer: Signer, types: string[], values: any[]): Promise<string>;
export declare function getSigner(types: string[], values: any[], signature: string): string;
export declare function encodeCallData(func: any, args: any, iface: any): any;
export declare function decodeCallData(call: any, iface: any): {
    func: any;
    args: any;
};
export declare function getRolesFromBytes(bytes: any, allRoles: any[]): any[];
export declare function getBytesFromRoles(roles: any[], allRoles: any[]): string;
