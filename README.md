# The Shield

The version 0.1 of the Shield is totally **unsecured**. It is still work in progress.

## API

### Core functions

-   `getDefaultFactory(signer: ethers.Signer, network: string): Promise<ethers.Contract>`: returns the Shield Factory contract deployed on `network`
-   `createCredentials(signer: ethers.Signer, to: ethers.Contract, func: string, args: any[]): Promise<Credentials>`: returns a new credentials to call the function `func` from the contract `to` with the args `args`.
-   `approveCredentials(signer: ethers.Signer, credentials: Credentials): Promise<Credentials>`: returns a newly approved credentials
-   `encodeCredentials(credentials: Credentials): string`: returns the base-64 encoded version of credentials
-   `decodeCredentials(encodedCredentials: string): Credential` returns the decoded credentials of the base-64 encoded string
-   `executeCredentials(signer: ethers.Signer, credentials: Credentials, iface: ethers.utils.Interface, options?)` execute the credentials
-   `createShield(signer: ethers.Signer, name: string, roles: any[], users: any[], policy: any[], factory: ethers.Contract): Promise<{receipt: ethers.Transaction, shield: Shield}>`: deploys a shield and returns the corresponding shield object (see below)
-   `instantiateShield(signer: ethers.Signer, address: string): Promise<Shield>`: returns a shield object (see below) of an existing deployed shield at `address`
-   `getShields(signer: ethers.Signer, factory: ethers.Contract): Promise<string[]>`: returns the list of shield's addresses for which the user `address` is one of the users
-   `function getShieldName(address: string, factory: ethers.Contract): Promise<string>`: returns the name of a Shield

### Methods of the `Shield` object

-   `getRoles(): Promise<string[]>`
-   `addInterface(address: string, iface: ethers.utils.Interface)`
-   `createCredentialsForAddRoles(signer: ethers.Signer, roles: string[]): Promise<Credentials>`
-   `getUsers(): Promise<{[address: string]: string[]}>`
-   `getUser(address: string): Promise<string[]>`
-   `createCredentialsForSetUsers(signer: ethers.Signer, users: Array<{ address: string; roles: string[] }>): Promise<Credentials>`
-   `getPolicies(): Promise<{[label: string]: string[][]}>`
-   `getPolicy(label: string): Promise<string[][]>`
-   `createCredentialsForAddPolicy(signer: ethers.Signer, label: string, policy: string[][]): Promise<Credentials>`
-   `getAssignedPolicies(): Promise<{[address: string]: {[func: string]: string}}>`
-   `getAssignedPolicy(to: string, func: string): Promise<string>`
-   `createCredentialsForAssignPolicy(signer: ethers.Signer, to: address, func: string, label: string)`
-   `isPaused(): Promise<boolean>`
-   `createCredentialsForPause(signer: ethers.Signer): Promise<Credentials>`
-   `createCredentialsForUnpause(signer: ethers.Signer)`
-   `createCredentialsForTransfer(signer: ethers.Signer, to: string, amount: number): Promise<Credentials>`
-   `burnCredentials(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>`
-   `checkCredentials(credentials: Credentials, full?: boolean):Promise<{to: string, func: string, args:any[], timestamp:number, approvals: string[]}>`
-   `executeCredentials(signer: ethers.Signer, credentials: Credentials): Promise<ethers.Transaction>`
-   `isBurnt(signer: ethers.Signer, credentials: Credentials):Promise<boolean>`
