export declare function getRolesFromBytes(bytes: any, allRoles: any[]): any[];
export declare function getBytesFromRoles(roles: any[], allRoles: any[]): string;
export declare function parseEvents(name: string, tx: {
    wait: () => any;
}): Promise<any>;
