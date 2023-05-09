/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  WalletCompanion,
  WalletCompanionInterface,
} from "../../../contracts/WalletCompanion.sol/WalletCompanion";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "TransferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052600080546001600160a01b031916331790556101ee806100256000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e1a7d4d1461003b578063cfaaa26614610050575b600080fd5b61004e610049366004610141565b610063565b005b61004e61005e36600461018f565b6100e7565b6000546001600160a01b0316331461007a57600080fd5b6000336001600160a01b031682604051610093906101b0565b60006040518083038185875af1925050503d80600081146100d0576040519150601f19603f3d011682016040523d82523d6000602084013e6100d5565b606091505b50509050806100e357600080fd5b5050565b6000546001600160a01b031633146100fe57600080fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b805b811461012d57600080fd5b50565b803561013b81610120565b92915050565b60006020828403121561015657610156600080fd5b60006101628484610130565b949350505050565b60006001600160a01b03821661013b565b6101228161016a565b803561013b8161017b565b6000602082840312156101a4576101a4600080fd5b60006101628484610184565b60008161013b56fea2646970667358221220fd1f16f47441da9170f624f1644c7357fd0cebaede444b31d199be850d44b73264736f6c63430008110033";

type WalletCompanionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WalletCompanionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WalletCompanion__factory extends ContractFactory {
  constructor(...args: WalletCompanionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<WalletCompanion> {
    return super.deploy(overrides || {}) as Promise<WalletCompanion>;
  }
  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): WalletCompanion {
    return super.attach(address) as WalletCompanion;
  }
  override connect(signer: Signer): WalletCompanion__factory {
    return super.connect(signer) as WalletCompanion__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WalletCompanionInterface {
    return new utils.Interface(_abi) as WalletCompanionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WalletCompanion {
    return new Contract(address, _abi, signerOrProvider) as WalletCompanion;
  }
}
