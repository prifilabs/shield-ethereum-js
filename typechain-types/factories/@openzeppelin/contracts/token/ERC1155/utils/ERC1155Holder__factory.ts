/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ERC1155Holder,
  ERC1155HolderInterface,
} from "../../../../../../@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder";

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
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
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
    name: "onERC1155Received",
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
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506104a2806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806301ffc9a714610046578063bc197c811461006f578063f23a6e611461009b575b600080fd5b610059610054366004610116565b6100ba565b6040516100669190610149565b60405180910390f35b61008e61007d36600461032b565b63bc197c8160e01b95945050505050565b6040516100669190610404565b61008e6100a9366004610412565b63f23a6e6160e01b95945050505050565b60006001600160e01b03198216630271189760e51b14806100eb57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6001600160e01b031981165b811461010857600080fd5b50565b80356100eb816100f1565b60006020828403121561012b5761012b600080fd5b6000610137848461010b565b949350505050565b8015155b82525050565b602081016100eb828461013f565b60006001600160a01b0382166100eb565b6100fd81610157565b80356100eb81610168565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff821117156101b8576101b861017c565b6040525050565b60006101ca60405190565b90506101d68282610192565b919050565b600067ffffffffffffffff8211156101f5576101f561017c565b5060209081020190565b806100fd565b80356100eb816101ff565b600061022361021e846101db565b6101bf565b8381529050602080820190840283018581111561024257610242600080fd5b835b8181101561026657806102578882610205565b84525060209283019201610244565b5050509392505050565b600082601f83011261028457610284600080fd5b8135610137848260208601610210565b600067ffffffffffffffff8211156102ae576102ae61017c565b601f19601f83011660200192915050565b82818337506000910152565b60006102d961021e84610294565b9050828152602081018484840111156102f4576102f4600080fd5b6102ff8482856102bf565b509392505050565b600082601f83011261031b5761031b600080fd5b81356101378482602086016102cb565b600080600080600060a0868803121561034657610346600080fd5b60006103528888610171565b955050602061036388828901610171565b945050604086013567ffffffffffffffff81111561038357610383600080fd5b61038f88828901610270565b935050606086013567ffffffffffffffff8111156103af576103af600080fd5b6103bb88828901610270565b925050608086013567ffffffffffffffff8111156103db576103db600080fd5b6103e788828901610307565b9150509295509295909350565b6001600160e01b03198116610143565b602081016100eb82846103f4565b600080600080600060a0868803121561042d5761042d600080fd5b60006104398888610171565b955050602061044a88828901610171565b945050604061045b88828901610205565b93505060606103bb8882890161020556fea2646970667358221220ae6697602234b8a5748e04ae1c0f85b43d07580acfd482170dd09b27115fd9fc64736f6c63430008110033";

type ERC1155HolderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155HolderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155Holder__factory extends ContractFactory {
  constructor(...args: ERC1155HolderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155Holder> {
    return super.deploy(overrides || {}) as Promise<ERC1155Holder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC1155Holder {
    return super.attach(address) as ERC1155Holder;
  }
  override connect(signer: Signer): ERC1155Holder__factory {
    return super.connect(signer) as ERC1155Holder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155HolderInterface {
    return new utils.Interface(_abi) as ERC1155HolderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155Holder {
    return new Contract(address, _abi, signerOrProvider) as ERC1155Holder;
  }
}