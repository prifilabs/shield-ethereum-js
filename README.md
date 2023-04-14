# The Shield

## API

### Core functions

-   `getDefaultFactory(signer: ethers.Signer, network: string): Promise<ethers.Contract>`: returns the Shield Factory contract deployed on `network`
-   `createShield(signer: ethers.Signer, name: string, roles: any[], users: any[], policy: any[], factory: ethers.Contract): Promise<{receipt: ethers.Transaction, shield: Shield}>`: deploys a shield and returns the corresponding shield object (see below)
-   `instantiateShield(signer: ethers.Signer, address: string): Promise<Shield>`: returns a shield object (see below) of an existing deployed shield at `address`
-   `getShields(signer: ethers.Signer, factory: ethers.Contract): Promise<{ [address: string]: string }>`: returns the list of shield's addresses for which the user `address` is one of the users

### Methods of the `Shield` object

Shield getters

-   `getRoles(): Promise<string[]>`
-   `getUsers(): Promise<{[address: string]: string[]}>`
-   `getUser(address: string): Promise<string[]>`
-   `getPolicies(): Promise<{[label: string]: string[][]}>`
-   `getPolicy(label: string): Promise<string[][]>`
-   `getAssignedPolicies(): Promise<{[address: string]: {[func: string]: string}}>`
-   `getAssignedPolicy(to: string, func: string): Promise<string>`
-   `isPaused(): Promise<boolean>`

Handling Interfaces

-   `addInterface(address: string, iface: ethers.utils.Interface)`
-   `getInterface(address: string): Promise<ethers.utils.Interface>`

Handling Credentials

-   `getCredentials(): Promise<Array<Credentials>>`
-   `createCredentials(to: string, func: string, args: any[]): Promise<Credentials>`: returns a new credentials to call the function `func` from the contract `to` with the args `args`.
-   `approveCredentials(credentials: Credentials): Promise<Credentials>`: returns a newly approved credentials
-   `checkCredentials(credentials: Credentials, full?: boolean):Promise<{to: string, func: string, args:any[], timestamp:number, approvals: string[]}>`
-   `executeCredentials(credentials: Credentials)` execute the credentials
-   `cancelCredentials(credentials: Credentials): Promise<ethers.Transaction>`
-   `isExecuted(credentials: Credentials):Promise<boolean>`
-   `isCanceled(credentials: Credentials):Promise<boolean>`

`createCredentials` wrappers

-   `createCredentialsForAddRoles(roles: string[]): Promise<Credentials>`
-   `createCredentialsForSetUsers(users: Array<{ address: string; roles: string[] }>): Promise<Credentials>`
-   `createCredentialsForAddPolicy(label: string, policy: string[][]): Promise<Credentials>`
-   `createCredentialsForAssignPolicy(to: address, func: string, label: string)`
-   `createCredentialsForPause(): Promise<Credentials>`
-   `createCredentialsForUnpause()`
-   `createCredentialsForTransfer(to: string, amount: number): Promise<Credentials>`

### Utils

-   `Utils.signData(signer: Signer, types: string[], values: any[])`
-   `Utils.getSigner(types: string[], values: any[], signature: string)`
-   `Utils.encodeCredentials(credentials: Credentials): string`: returns the base-64 encoded version of credentials
-   `Utils.decodeCredentials(encodedCredentials: string): Credential` returns the decoded credentials of the base-64 encoded string
-   `Utils.getSignature(func, iface)`
-   `Utils.getFunction(sig, iface)`
-   `Utils.encodeCallData(func, args, iface)`
-   `Utils.decodeCallData(call, iface)`
-   `Utils.getBytesFromRoles(roles: any[], allRoles: any[])`
-   `Utils.getRolesFromBytes(bytes: any, allRoles: any[])`
