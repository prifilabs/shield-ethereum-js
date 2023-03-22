/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  Shieldable,
  ShieldableInterface,
} from "../../../contracts/Shield.sol/Shieldable";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "InvalidCredentials",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "c",
        type: "address",
      },
    ],
    name: "IsShieldable",
    type: "event",
  },
] as const;

export class Shieldable__factory {
  static readonly abi = _abi;
  static createInterface(): ShieldableInterface {
    return new utils.Interface(_abi) as ShieldableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Shieldable {
    return new Contract(address, _abi, signerOrProvider) as Shieldable;
  }
}