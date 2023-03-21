import { Signer, Contract, constants, utils } from "ethers";

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function bytesToNumber(bytes) {
  let byteArray = utils.arrayify(bytes);
  let result = 0;
  for (let i = 0; i < byteArray.length; i++) {
    result = result * 256 + byteArray[i];
  }

  return result;
}

function getRolesFromBytes(bytes, allRoles) {
  let total = bytesToNumber(bytes);
  let roles = allRoles.filter((_, index) => {
    return bit_test(total, index);
  });
  return roles;
}

// https://stackoverflow.com/a/8436459/9894569
function bit_test(num, bit) {
  return (num >> bit) % 2 != 0;
}

function bit_set(num, bit) {
  return num | (1 << bit);
}

function getBytesFromRoles(roles, allRoles) {
  let num = 0;
  roles.forEach((role) => {
    const index = allRoles.findIndex((val) => val === role);
    if (index === -1) throw new Error("did not find role");
    num = bit_set(num, index);
  });
  return numberToBytes(num);
}

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function numberToBytes(number) {
    const buffer = new ArrayBuffer(8);
    const byteArray = new DataView(buffer);
    byteArray.setBigUint64(0, BigInt(number), false);
    return utils.hexlify(new Uint8Array(buffer)); 
}

function signData(signer:Signer, types:string[], values:any[]){
    let message = utils.arrayify(utils.keccak256(utils.defaultAbiCoder.encode(types, values)));
    return signer.signMessage(message);
}

function getSigner(types:string[], values:any[], signature:string){
    let message = utils.arrayify(utils.keccak256(utils.defaultAbiCoder.encode(types, values)));
    return utils.verifyMessage(message, signature);
}

export interface Credentials {
    to: string;
    call: string;
    timestamp: number;
    approvals: string[];
}

export async function createCredentials(signer:Signer, to:Contract, fragment:string, args:any[]): Promise<Credentials>{
    const nullCredential = {to: constants.AddressZero, call:constants.HashZero, timestamp: 0, approvals: []};   
    let call = to.interface.encodeFunctionData(fragment, [...args, nullCredential]);
    let types = to.interface.getFunction(fragment).inputs.map(function(input){
        return input.type;
    });
    types = types.slice(0,-1);
    const len = utils.defaultAbiCoder.encode(types, args).length;
    call = call.slice(0, len + 8);
    const timestamp = Math.floor(new Date().getTime());
    const signature = await signData(signer, ['address', 'bytes', 'uint'], [to.address, call, timestamp]);
    return {to: to.address, call, timestamp, approvals: [signature]};
}

export async function approveCredentials(signer: Signer, credentials: Credentials): Promise<Credentials>{
    const {to, call, timestamp, approvals} = credentials;
    const lastSignature = approvals[approvals.length-1];
    const signature = await signData(signer, ['bytes'], [lastSignature]);
    return {to, call, timestamp, approvals: [...approvals, signature]};
}

export function encodeCredentials(credentials: Credentials):string{
      const {to, call, timestamp, approvals} = credentials;
      return btoa(JSON.stringify({to, call, timestamp, approvals: approvals.map(btoa)}));
}

export function decodeCredentials(encodedCredentials:string):Credentials{
    const {to, call, timestamp, approvals} = JSON.parse(atob(encodedCredentials));
    return {to, call, timestamp, approvals: approvals.map(atob)};
}

async function parseEvents(name, tx){
    const receipt = await tx.wait();
    const event = receipt.events.find((event) => event.event === name);
    const args = event?.args;
    return args;
}

export async function getAllShieldAddresses(signer: Signer){

}

export async function createShield(signer, name, roles, users, policy, factory?, shield?){
    const _name = utils.formatBytes32String(name);
    const _roles = roles.map(utils.formatBytes32String);
    const _users = users.map(function(user){
        const rolesAssigned = user.roles.map(utils.formatBytes32String);
        return {addr: user.addr, roles: getBytesFromRoles(rolesAssigned, _roles)}
    });
    const _policy = policy.map(function(step){
        const rolesAssigned = step.map(utils.formatBytes32String);
        return getBytesFromRoles(rolesAssigned, _roles);
    });
    const shieldTx = await factory.connect(signer).createShield(_name, _roles, _users, _policy);
    const [_, address] = await parseEvents("ShieldCreated", shieldTx);
    return createShieldInstance(signer, address, shield);
}

export async function createShieldInstance(signer, address, shield?){
    let contract = new Contract(address, shield.interface, signer);
    return new Shield(contract, signer);
}

export class Shield {
    public contract: Contract; 
    public signer: Signer;
 
    constructor(contract:Contract, signer:Signer) {
        this.contract = contract;
        this.signer = signer;
    }
    
    async getRoles(){
        const roles = await this.contract.getRoles();
        return roles.map(utils.parseBytes32String);
    }
    
    async createCredentialsForAddRoles(roles){
        const newRoles = roles.map(utils.formatBytes32String);
        return createCredentials(this.signer, this.contract, "addRoles", [newRoles]);
    }
    
    async addRoles(roles, credentials){
        const newRoles = roles.map(utils.formatBytes32String);
        return this.contract.connect(this.signer).addRoles(newRoles, credentials);
    }
    
    async getUsers(){
    
    }
 
    async getUser(address){
        const roles = await this.contract.getRoles();
        const bits = await this.contract.getUser(address);
        return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
    }

    async createCredentialsForSetUser(address, roles){
        const existingRoles = await this.contract.getRoles();
        const newRoles = getBytesFromRoles(roles.map(utils.formatBytes32String), existingRoles);
        return createCredentials(this.signer, this.contract, "setUser", [address, newRoles]);
    }

    async setUser(address, roles, credentials){
        const existingRoles = await this.contract.getRoles();
        const newRoles = getBytesFromRoles(roles.map(utils.formatBytes32String), existingRoles);
        return this.contract.connect(this.signer).setUser(address, newRoles, credentials);
    }

    async getRules(){
    
    }

    async getRule(label){
        const roles = await this.contract.getRoles();
        const policy = await this.contract.getRule(utils.formatBytes32String(label));
        return policy.map(function(bits){
            return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
        });
    }

    async createCredentialsForAddRule(label, policy){
        const roles = await this.contract.getRoles();
        const newLabel = utils.formatBytes32String(label);
        const newPolicy = policy.map(function(step){
            return getBytesFromRoles(step.map(utils.formatBytes32String), roles);
        });
        return createCredentials(this.signer, this.contract, "addRule", [newLabel, newPolicy]);
    }

    async addRule(label, policy, credentials){
        const roles = await this.contract.getRoles();
        const newLabel = utils.formatBytes32String(label);
        const newPolicy = policy.map(function(step){
            return getBytesFromRoles(step.map(utils.formatBytes32String), roles);
        });
        return this.contract.connect(this.signer).addRule(newLabel, newPolicy, credentials);
    }

    async getAssignments(){
    
    }

    async getAssignment(to, f){
        const roles = await this.contract.getRoles();
        let sig = to.interface.getSighash(f);
        const policy = await this.contract.getAssignment(to.address, sig)
        return policy.map(function(bits){
            return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
        });
    }

    async createCredentialsForAssignRule(to, f, label){
        const sig = to.interface.getSighash(f);
        const newLabel = utils.formatBytes32String(label);
        return createCredentials(this.signer, this.contract, "assignRule", [to.address, sig, newLabel]);
    }

    async assignRule(to, f, label, credentials){
        const sig = to.interface.getSighash(f);
        const newLabel = utils.formatBytes32String(label);
        return this.contract.connect(this.signer).assignRule(to.address, sig, newLabel, credentials);
    }
}
