# The Shield

The version 0.1 of the Shield is totally **unsecured**. It is still work in progress. 

## API

### Core functions

- `getDefaultFactory(signer: ethers.Signer, network: string): Promise<ethers.Contract>`: returns the Shield Factory contract deployed on `network`
- `createCredentials(signer: ethers.Signer, to: ethers.Contract, func: string, args: any[]): Promise<Credentials>`: returns a new credentials to call the function `func` from the contract `to` with the args `args`.
- `approveCredentials(signer: ethers.Signer, credentials: Credentials): Promise<Credentials>`: returns a newly approved credentials
- `encodeCredentials(credentials: Credentials): string`: returns the base-64 encoded version of credentials
- `decodeCredentials(encodedCredentials: string): Credential` returns the decoded credentials of the base-64 encoded string
- `createShield(signer: ethers.Signer, name: string, roles: any[], users: any[], policy: any[], factory: ethers.Contract): Promise<Shield>`: deploys a shield and returns the corresponding shield object (see below)
- `instantiateShield(signer: ethers.Signer, address: string): Promise<Shield>`: returns a shield object (see below) of an existing deployed shield at `address`
- `getShields(provider, address: string, factory: ethers.Contract): Promise<string[]>`: returns the list of shield's addresses for which the user `address` is one of the users
    
### Methods of the `Shield` object

- `getRoles(): Promise<string[]>`
- `createCredentialsForAddRoles(signer: ethers.Signer, roles: string[]): Promise<Credentials>`
- `addRoles(signer: ethers.Signer, roles: string[], credentials: Credentials)`
- `getUsers(provider): Promise<{[address: string]: string[]}>`
- `getUser(address: string): Promise<string[]>`
- `createCredentialsForSetUser(signer: ethers.Signer, address: any, roles: string[]): Promise<Credentials>`
- `setUser(signer: ethers.Signer, address: any, roles: string[], credentials: Credentials)`
- `getPolicies(provider): Promise<{[label: string]: string[][]}>`
- `getPolicy(label: string): Promise<string[][]>`
- `createCredentialsForAddPolicy(signer: ethers.Signer, label: string, policy: string[][]): Promise<Credentials>`
- `addPolicy(signer: ethers.Signer, label: string, policy: string[][], credentials: Credentials)`
- `getAssignedPolicies(provider): Promise<{[address: string]: {[func: string]: string}}>`
- `getAssignedPolicy(to: address, func: string): Promise<string>`
- `createCredentialsForAssignPolicy(signer: ethers.Signer, to: address, func: string, label: string)`
- `assignPolicy(signer: ethers.Signer, to: address, func: string, label: string, credentials: Credentials)`
- `isPaused(): Promise<boolean>`
- `createCredentialsForPause(signer: ethers.Signer): Promise<Credentials>`
- `pause(signer: ethers.Signer, credentials: Credentials)`
- `createCredentialsForUnpause(signer: ethers.Signer)`
- `unpause(signer: ethers.Signer, credentials: Credentials)`
- `createCredentialsForTransfer(signer: ethers.Signer, to: string, amount: number): Promise<Credentials>`
- `transfer(signer: ethers.Signer, to: string, amount: number, credentials: Credentials)`
- `burnCredentials(signer: ethers.Signer, credentials: Credentials)`
- `checkCredentials(credentials: Credentials, full?: boolean):Promise<{to: string, func: string, args:any[], timestamp:number, approvals: string[]}>`
