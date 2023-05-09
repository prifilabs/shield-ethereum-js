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
  WalletExampleWithoutShield,
  WalletExampleWithoutShieldInterface,
} from "../../../contracts/WalletCompanion.sol/WalletExampleWithoutShield";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
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
  "0x6080604052600080546001600160a01b03191633179055610127806100256000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632e1a7d4d14602d575b600080fd5b603c603836600460c5565b603e565b005b6000546001600160a01b03163314605457600080fd5b6000336001600160a01b031682604051606b9060ea565b60006040518083038185875af1925050503d806000811460a6576040519150601f19603f3d011682016040523d82523d6000602084013e60ab565b606091505b505090508060b857600080fd5b5050565b80355b92915050565b60006020828403121560d85760d8600080fd5b600060e2848460bc565b949350505050565b60008160bf56fea26469706673582212207b76dd51eede484e18be059fbfe89fbe535b8432e356b59621731bee5944c40e64736f6c63430008110033";

type WalletExampleWithoutShieldConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WalletExampleWithoutShieldConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WalletExampleWithoutShield__factory extends ContractFactory {
  constructor(...args: WalletExampleWithoutShieldConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<WalletExampleWithoutShield> {
    return super.deploy(overrides || {}) as Promise<WalletExampleWithoutShield>;
  }
  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): WalletExampleWithoutShield {
    return super.attach(address) as WalletExampleWithoutShield;
  }
  override connect(signer: Signer): WalletExampleWithoutShield__factory {
    return super.connect(signer) as WalletExampleWithoutShield__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WalletExampleWithoutShieldInterface {
    return new utils.Interface(_abi) as WalletExampleWithoutShieldInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WalletExampleWithoutShield {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as WalletExampleWithoutShield;
  }
}
