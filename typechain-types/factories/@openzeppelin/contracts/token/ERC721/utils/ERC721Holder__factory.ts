/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ERC721Holder,
  ERC721HolderInterface,
} from "../../../../../../@openzeppelin/contracts/token/ERC721/utils/ERC721Holder";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610278806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063150b7a0214610030575b600080fd5b61004e61003e3660046101ad565b630a85bd0160e11b949350505050565b60405161005b919061022c565b60405180910390f35b60006001600160a01b0382165b92915050565b61008081610064565b811461008b57600080fd5b50565b803561007181610077565b80610080565b803561007181610099565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff821117156100e6576100e66100aa565b6040525050565b60006100f860405190565b905061010482826100c0565b919050565b600067ffffffffffffffff821115610123576101236100aa565b601f19601f83011660200192915050565b82818337506000910152565b600061015361014e84610109565b6100ed565b90508281526020810184848401111561016e5761016e600080fd5b610179848285610134565b509392505050565b600082601f83011261019557610195600080fd5b81356101a5848260208601610140565b949350505050565b600080600080608085870312156101c6576101c6600080fd5b60006101d2878761008e565b94505060206101e38782880161008e565b93505060406101f48782880161009f565b925050606085013567ffffffffffffffff81111561021457610214600080fd5b61022087828801610181565b91505092959194509250565b6001600160e01b0319821681526020810161007156fea26469706673582212202e5f23dad38d55dcc45dcb15d20cdab37a85f669e37ccc17f9d7b84ddb2f621b64736f6c63430008110033";

type ERC721HolderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721HolderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Holder__factory extends ContractFactory {
  constructor(...args: ERC721HolderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721Holder> {
    return super.deploy(overrides || {}) as Promise<ERC721Holder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC721Holder {
    return super.attach(address) as ERC721Holder;
  }
  override connect(signer: Signer): ERC721Holder__factory {
    return super.connect(signer) as ERC721Holder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721HolderInterface {
    return new utils.Interface(_abi) as ERC721HolderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Holder {
    return new Contract(address, _abi, signerOrProvider) as ERC721Holder;
  }
}