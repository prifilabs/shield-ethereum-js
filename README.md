# The Shield

The version 0.1 of the Shield is totally **unsecured**. It is still work in progress.

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

Handling credentials

-   `createCredentials(signer: ethers.Signer, to: string, func: string, args: any[]): Promise<Credentials>`: returns a new credentials to call the function `func` from the contract `to` with the args `args`.
-   `approveCredentials(signer: ethers.Signer, credentials: Credentials): Promise<Credentials>`: returns a newly approved credentials
-   `checkCredentials(credentials: Credentials, full?: boolean):Promise<{to: string, func: string, args:any[], timestamp:number, approvals: string[]}>`
-   `executeCredentials(signer: ethers.Signer, credentials: Credentials)` execute the credentials
-   `cancelCredentials(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>`
-   `isExecuted(credentials: Credentials):Promise<boolean>`
-   `isCanceled(credentials: Credentials):Promise<boolean>`

`createCredentials` wrappers

-   `createCredentialsForAddRoles(signer: ethers.Signer, roles: string[]): Promise<Credentials>`
-   `createCredentialsForSetUsers(signer: ethers.Signer, users: Array<{ address: string; roles: string[] }>): Promise<Credentials>`
-   `createCredentialsForAddPolicy(signer: ethers.Signer, label: string, policy: string[][]): Promise<Credentials>`
-   `createCredentialsForAssignPolicy(signer: ethers.Signer, to: address, func: string, label: string)`
-   `createCredentialsForPause(signer: ethers.Signer): Promise<Credentials>`
-   `createCredentialsForUnpause(signer: ethers.Signer)`
-   `createCredentialsForTransfer(signer: ethers.Signer, to: string, amount: number): Promise<Credentials>`

### Method of `Store` object

Storing interfaces

-   `addInterface(address: string, iface: ethers.utils.Interface)`
-   `getInterface(address: string): ethers.utils.Interface`

Storing credentials

-   `addCredential`
-   `updateCredential`
-   `getCredentials`

### Utils

-   `signData(signer: Signer, types: string[], values: any[])`
-   `getSigner(types: string[], values: any[], signature: string)`
-   `encodeCredentials(credentials: Credentials): string`: returns the base-64 encoded version of credentials
-   `decodeCredentials(encodedCredentials: string): Credential` returns the decoded credentials of the base-64 encoded string
-   `getSignature(func, iface)`
-   `getFunction(sig, iface)`
-   `encodeCallData(func, args, iface)`
-   `decodeCallData(call, iface)`
-   `getBytesFromRoles(roles: any[], allRoles: any[])`
-   `getRolesFromBytes(bytes: any, allRoles: any[])`
