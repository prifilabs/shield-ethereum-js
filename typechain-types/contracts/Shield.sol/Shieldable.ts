/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ShieldableInterface extends utils.Interface {
  functions: {};

  events: {
    "IsShieldable(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "IsShieldable"): EventFragment;
}

export interface IsShieldableEventObject {
  c: string;
}
export type IsShieldableEvent = TypedEvent<[string], IsShieldableEventObject>;

export type IsShieldableEventFilter = TypedEventFilter<IsShieldableEvent>;

export interface Shieldable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ShieldableInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {
    "IsShieldable(address)"(c?: null): IsShieldableEventFilter;
    IsShieldable(c?: null): IsShieldableEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
