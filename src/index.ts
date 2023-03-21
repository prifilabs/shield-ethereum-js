import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Signer,
  Contract,
  constants,
  utils,
  ContractFactory,
  ContractInterface,
  ContractTransaction,
} from "ethers";
import { Result } from "ethers/lib/utils";
import { Shield__factory } from "../typechain-types";
import { User } from "./types";

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function bytesToNumber(bytes: number | utils.BytesLike | utils.Hexable) {
  let byteArray = utils.arrayify(bytes);
  let result = 0;
  for (let i = 0; i < byteArray.length; i++) {
    result = result * 256 + byteArray[i];
  }

  return result;
}

function getRolesFromBytes(bytes: Uint8Array, allRoles: string[]) {
  let total = bytesToNumber(bytes);
  let roles = allRoles.filter((_, index) => {
    return bit_test(total, index);
  });
  return roles;
}

// https://stackoverflow.com/a/8436459/9894569
function bit_test(num: number, bit: number) {
  return (num >> bit) % 2 != 0;
}

function bit_set(num: number, bit: number) {
  return num | (1 << bit);
}

function getBytesFromRoles(roles: string[], allRoles: string[]) {
  let num = 0;
  roles.forEach((role: any) => {
    const index = allRoles.findIndex((val: any) => val === role);
    if (index === -1) throw new Error("did not find role");
    num = bit_set(num, index);
  });
  return numberToBytes(num);
}

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function numberToBytes(number: string | number | bigint | boolean) {
  const buffer = new ArrayBuffer(8);
  const byteArray = new DataView(buffer);
  byteArray.setBigUint64(0, BigInt(number), false);
  return utils.hexlify(new Uint8Array(buffer));
}

function signData(signer: Signer, types: string[], values: any[]) {
  let message = utils.arrayify(
    utils.keccak256(utils.defaultAbiCoder.encode(types, values))
  );
  return signer.signMessage(message);
}

function getSigner(types: string[], values: any[], signature: string) {
  let message = utils.arrayify(
    utils.keccak256(utils.defaultAbiCoder.encode(types, values))
  );
  return utils.verifyMessage(message, signature);
}

export interface Credentials {
  to: string;
  call: string;
  timestamp: number;
  approvals: string[];
}

export async function createCredentials(
  signer: Signer,
  to: Contract,
  fragment: string,
  args: any[]
): Promise<Credentials> {
  const nullCredential = {
    to: constants.AddressZero,
    call: constants.HashZero,
    timestamp: 0,
    approvals: [],
  };
  let call = to.interface.encodeFunctionData(fragment, [
    ...args,
    nullCredential,
  ]);
  let types = to.interface.getFunction(fragment).inputs.map(function (input) {
    return input.type;
  });
  types = types.slice(0, -1);
  const len = utils.defaultAbiCoder.encode(types, args).length;
  call = call.slice(0, len + 8);
  const timestamp = Math.floor(new Date().getTime());
  const signature = await signData(
    signer,
    ["address", "bytes", "uint"],
    [to.address, call, timestamp]
  );
  return { to: to.address, call, timestamp, approvals: [signature] };
}

export async function approveCredentials(
  signer: Signer,
  credentials: Credentials
): Promise<Credentials> {
  const { to, call, timestamp, approvals } = credentials;
  const lastSignature = approvals[approvals.length - 1];
  const signature = await signData(signer, ["bytes"], [lastSignature]);
  return { to, call, timestamp, approvals: [...approvals, signature] };
}

export function encodeCredentials(credentials: Credentials): string {
  const { to, call, timestamp, approvals } = credentials;
  return Buffer.from(
    JSON.stringify({ to, call, timestamp, approvals })
  ).toString("base64");
}

export function decodeCredentials(encodedCredentials: string): Credentials {
  const { to, call, timestamp, approvals } = JSON.parse(
    Buffer.from(encodedCredentials, "base64").toString("utf-8")
  );
  return { to, call, timestamp, approvals };
}

async function parseEvents(
  name: string,
  tx: ContractTransaction
): Promise<Result> {
  const receipt = await tx.wait();
  if (!receipt.events) throw new Error("receipt events undefined");
  const event = receipt.events.find((event) => event.event === name);
  const args = event.args;
  return args;
}

export async function getAllShieldAddresses(signer: Signer) {}

export async function createShield(
  signer: Signer,
  name: string,
  roles: string[],
  users: User[],
  policy: string[][],
  factory: Contract,
  shield: Shield__factory
) {
  const _name = utils.formatBytes32String(name);
  const _roles = roles.map(utils.formatBytes32String);
  const _users = users.map((user) => {
    const rolesAssigned = user.roles.map(utils.formatBytes32String);
    return { addr: user.addr, roles: getBytesFromRoles(rolesAssigned, _roles) };
  });
  const _policy = policy.map((step) => {
    const rolesAssigned = step.map(utils.formatBytes32String);
    return getBytesFromRoles(rolesAssigned, _roles);
  });
  const shieldTx = await factory
    .connect(signer)
    .createShield(_name, _roles, _users, _policy);
  const [_, address] = await parseEvents("ShieldCreated", shieldTx);
  return createShieldInstance(signer, address, shield);
}

export async function createShieldInstance(
  signer: Signer,
  address: string,
  shield: Shield__factory
) {
  let contract = new Contract(address, shield.interface, signer);
  return new Shield(contract, signer);
}

export class Shield {
  public contract: Contract;
  public signer: Signer;

  constructor(contract: Contract, signer: Signer) {
    this.contract = contract;
    this.signer = signer;
  }

  async getRoles() {
    const roles = await this.contract.getRoles();
    return roles.map(utils.parseBytes32String);
  }

  async createCredentialsForAddRoles(roles: string[]) {
    const newRoles = roles.map(utils.formatBytes32String);
    return createCredentials(this.signer, this.contract, "addRoles", [
      newRoles,
    ]);
  }

  async addRoles(roles: string[], credentials: Credentials) {
    const newRoles = roles.map(utils.formatBytes32String);
    return this.contract.connect(this.signer).addRoles(newRoles, credentials);
  }

  async getUsers() {}

  async getUser(address: any) {
    const roles = await this.contract.getRoles();
    const bits = await this.contract.getUser(address);
    return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
  }

  async createCredentialsForSetUser(address: any, roles: string[]) {
    const existingRoles = await this.contract.getRoles();
    const newRoles = getBytesFromRoles(
      roles.map(utils.formatBytes32String),
      existingRoles
    );
    return createCredentials(this.signer, this.contract, "setUser", [
      address,
      newRoles,
    ]);
  }

  async setUser(address: any, roles: string[], credentials: any) {
    const existingRoles = await this.contract.getRoles();
    const newRoles = getBytesFromRoles(
      roles.map(utils.formatBytes32String),
      existingRoles
    );
    return this.contract
      .connect(this.signer)
      .setUser(address, newRoles, credentials);
  }

  async getRules() {}

  async getRule(label: string) {
    const roles = await this.contract.getRoles();
    const policy = await this.contract.getRule(
      utils.formatBytes32String(label)
    );
    return policy.map(function (bits: Uint8Array) {
      return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
    });
  }

  async createCredentialsForAddRule(label: string, policy: any[]) {
    const roles = await this.contract.getRoles();
    const newLabel = utils.formatBytes32String(label);
    const newPolicy = policy.map(function (step: string[]) {
      return getBytesFromRoles(step.map(utils.formatBytes32String), roles);
    });
    return createCredentials(this.signer, this.contract, "addRule", [
      newLabel,
      newPolicy,
    ]);
  }

  async addRule(label: string, policy: any[], credentials: any) {
    const roles = await this.contract.getRoles();
    const newLabel = utils.formatBytes32String(label);
    const newPolicy = policy.map(function (step: string[]) {
      return getBytesFromRoles(step.map(utils.formatBytes32String), roles);
    });
    return this.contract
      .connect(this.signer)
      .addRule(newLabel, newPolicy, credentials);
  }

  async getAssignments() {}

  async getAssignment(
    to: { interface: { getSighash: (arg0: any) => any }; address: any },
    f: any
  ) {
    const roles = await this.contract.getRoles();
    let sig = to.interface.getSighash(f);
    const policy = await this.contract.getAssignment(to.address, sig);
    return policy.map(function (bits: Uint8Array) {
      return getRolesFromBytes(bits, roles).map(utils.parseBytes32String);
    });
  }

  async createCredentialsForAssignRule(
    to: { interface: { getSighash: (arg0: any) => any }; address: any },
    f: any,
    label: string
  ) {
    const sig = to.interface.getSighash(f);
    const newLabel = utils.formatBytes32String(label);
    return createCredentials(this.signer, this.contract, "assignRule", [
      to.address,
      sig,
      newLabel,
    ]);
  }

  async assignRule(
    to: { interface: { getSighash: (arg0: any) => any }; address: any },
    f: any,
    label: string,
    credentials: any
  ) {
    const sig = to.interface.getSighash(f);
    const newLabel = utils.formatBytes32String(label);
    return this.contract
      .connect(this.signer)
      .assignRule(to.address, sig, newLabel, credentials);
  }

  async isPaused() {
    return this.contract.paused();
  }

  async createCredentialsForPause() {
    return createCredentials(this.signer, this.contract, "pause", []);
  }

  async pause(credentials: any) {
    return this.contract.pause(credentials);
  }

  async createCredentialsForUnpause() {
    return createCredentials(this.signer, this.contract, "unpause", []);
  }

  async unpause(credentials: any) {
    return this.contract.unpause(credentials);
  }

  async validateCredentials(credentials: any) {
    try {
      await this.contract.validateCredentials(credentials);
      return true;
    } catch (error) {
      return false;
    }
  }
}
