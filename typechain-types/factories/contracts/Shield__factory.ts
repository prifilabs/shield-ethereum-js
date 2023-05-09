/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Shield, ShieldInterface } from "../../contracts/Shield";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    inputs: [
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "ShieldError",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes8[]",
        name: "policy",
        type: "bytes8[]",
      },
    ],
    name: "PolicyAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "PolicyAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "roles",
        type: "bytes32[]",
      },
    ],
    name: "RolesAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "bytes8",
            name: "roles",
            type: "bytes8",
          },
        ],
        indexed: false,
        internalType: "struct User[]",
        name: "users",
        type: "tuple[]",
      },
    ],
    name: "UsersSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        internalType: "bytes8[]",
        name: "policy",
        type: "bytes8[]",
      },
    ],
    name: "addPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_roles",
        type: "bytes32[]",
      },
    ],
    name: "addRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "assignPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainid",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "call",
            type: "bytes",
          },
          {
            internalType: "bytes[]",
            name: "approvals",
            type: "bytes[]",
          },
        ],
        internalType: "struct Credentials",
        name: "credentials",
        type: "tuple",
      },
    ],
    name: "cancelCredentials",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "canceled",
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
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainid",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "call",
            type: "bytes",
          },
          {
            internalType: "bytes[]",
            name: "approvals",
            type: "bytes[]",
          },
        ],
        internalType: "struct Credentials",
        name: "credentials",
        type: "tuple",
      },
    ],
    name: "executeCredentials",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "executed",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
    ],
    name: "getAssignedPolicy",
    outputs: [
      {
        internalType: "bytes8[]",
        name: "",
        type: "bytes8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
    ],
    name: "getPolicy",
    outputs: [
      {
        internalType: "bytes8[]",
        name: "",
        type: "bytes8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRoles",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUser",
    outputs: [
      {
        internalType: "bytes8",
        name: "",
        type: "bytes8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bytes8",
        name: "_roles",
        type: "bytes8",
      },
    ],
    name: "hasAnyRoles",
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
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_roles",
        type: "bytes32[]",
      },
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "bytes8",
            name: "roles",
            type: "bytes8",
          },
        ],
        internalType: "struct User[]",
        name: "_users",
        type: "tuple[]",
      },
      {
        internalType: "bytes8[]",
        name: "policy",
        type: "bytes8[]",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "addr",
            type: "address",
          },
          {
            internalType: "bytes8",
            name: "roles",
            type: "bytes8",
          },
        ],
        internalType: "struct User[]",
        name: "_users",
        type: "tuple[]",
      },
    ],
    name: "setUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainid",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "call",
            type: "bytes",
          },
          {
            internalType: "bytes[]",
            name: "approvals",
            type: "bytes[]",
          },
        ],
        internalType: "struct Credentials",
        name: "credentials",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "full",
        type: "bool",
      },
    ],
    name: "validateCredentials",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50600080546001600160a01b03191630179055600180556200003262000038565b62000137565b600054600160a81b900460ff16156200006e5760405162461bcd60e51b81526004016200006590620000d5565b60405180910390fd5b60005460ff600160a01b90910481161015620000d3576000805460ff60a01b191660ff60a01b1790556040517f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890620000ca9060ff9062000127565b60405180910390a15b565b602080825281016200012181602781527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469602082015266616c697a696e6760c81b604082015260600190565b92915050565b60ff821681526020810162000121565b61284780620001476000396000f3fe6080604052600436106101095760003560e01c80636bc49871116100955780638456cb59116100645780638456cb5914610307578063a3f685f91461031c578063a9fcfb331461033c578063d6f5e21b1461036c578063dd4f120e1461038c57600080fd5b80636bc49871146102455780636f77926b1461027257806371061398146102b85780637434c105146102da57600080fd5b80633ff8ca59116100dc5780633ff8ca59146101ab5780635784091e146101cb5780635c975abb146101eb5780635e7c67db1461020557806367eae18b1461022557600080fd5b8063101970f71461010e5780631c439266146101305780632cfcf272146101765780633f4ba83a14610196575b600080fd5b34801561011a57600080fd5b5061012e6101293660046117dd565b6103ac565b005b34801561013c57600080fd5b5061016061014b366004611838565b60086020526000908152604090205460ff1681565b60405161016d919061186b565b60405180910390f35b34801561018257600080fd5b5061012e6101913660046118b9565b610405565b3480156101a257600080fd5b5061012e610427565b3480156101b757600080fd5b506101606101c6366004611924565b610473565b3480156101d757600080fd5b5061012e6101e636600461197c565b6104b0565b3480156101f757600080fd5b506002546101609060ff1681565b34801561021157600080fd5b5061012e6102203660046119b6565b610585565b34801561023157600080fd5b5061012e610240366004611b49565b610666565b34801561025157600080fd5b50610265610260366004611b83565b610689565b60405161016d9190611c23565b34801561027e57600080fd5b506102ab61028d366004611c3b565b6001600160a01b031660009081526004602052604090205460c01b90565b60405161016d9190611c5c565b3480156102c457600080fd5b506102cd610741565b60405161016d9190611cba565b3480156102e657600080fd5b506102fa6102f5366004611cde565b610799565b60405161016d9190611d7d565b34801561031357600080fd5b5061012e610c6b565b34801561032857600080fd5b50610265610337366004611838565b610cba565b34801561034857600080fd5b50610160610357366004611838565b60076020526000908152604090205460ff1681565b61037f61037a36600461197c565b610d49565b60405161016d9190611de6565b34801561039857600080fd5b5061012e6103a7366004611e41565b610eeb565b6000546001600160a01b031633146103c357600080fd5b610400838383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506111ba92505050565b505050565b6000546001600160a01b0316331461041c57600080fd5b6104008383836112f6565b6000546001600160a01b0316331461043e57600080fd5b6002805460ff191690556040517fa45f47fdea8a1efdd9029a5691c7f759c32b7c698632b563573e155625d1693390600090a1565b60008082610499856001600160a01b031660009081526004602052604090205460c01b90565b166001600160c01b03191615159150505b92915050565b60006104bd826000610799565b905060005b815181101561040057336001600160a01b03168282815181106104e7576104e7611eeb565b60200260200101516001600160a01b031603610573576001600860006105106080870187611f01565b600081811061052157610521611eeb565b90506020028101906105339190611f5d565b604051610541929190611fd2565b6040518091039020815260200190815260200160002060006101000a81548160ff021916908315150217905550505050565b8061057d81611ff5565b9150506104c2565b6000546001600160a01b0316331461059c57600080fd5b6003546040906105ad90839061200f565b11156105d5576040516330f4936760e21b81526004016105cc9061206b565b60405180910390fd5b60005b818110156106285760038383838181106105f4576105f4611eeb565b835460018101855560009485526020948590209190940292909201359190920155508061062081611ff5565b9150506105d8565b507fdc3627b8a50594a2c055615b1dd1ef69f5dc80de35b405d1550f8bc7276e71ee828260405161065a9291906120b7565b60405180910390a15050565b6000546001600160a01b0316331461067d57600080fd5b61068681611366565b50565b6001600160a01b03821660009081526006602090815260408083206001600160e01b031985168452825280832054808452600583529281902080548251818502810185019093528083526060949383018282801561073357602002820191906000526020600020906000905b82829054906101000a900460c01b6001600160c01b031916815260200190600801906020826007010492830192600103820291508084116106f55790505b505050505091505092915050565b6060600380548060200260200160405190810160405280929190818152602001828054801561078f57602002820191906000526020600020905b81548152602001906001019080831161077b575b5050505050905090565b6060468360200135146107bf57604051632022058360e01b81526004016105cc906120f4565b6107cc6080840184611f01565b90506000036107ee57604051632022058360e01b81526004016105cc90612138565b60006108286108036060860160408701611c3b565b6108106060870187611f5d565b61081f91600491600091612148565b61026091612178565b9050821561095e57600860006108416080870187611f01565b600081811061085257610852611eeb565b90506020028101906108649190611f5d565b604051610872929190611fd2565b604080519182900390912082526020820192909252016000205460ff16156108ad57604051632022058360e01b81526004016105cc906121e7565b600760006108be6080870187611f01565b60008181106108cf576108cf611eeb565b90506020028101906108e19190611f5d565b6040516108ef929190611fd2565b604080519182900390912082526020820192909252016000205460ff161561092a57604051632022058360e01b81526004016105cc9061223a565b80516109396080860186611f01565b90501461095957604051632022058360e01b81526004016105cc9061227e565b61098e565b805161096d6080860186611f01565b9050111561098e57604051632022058360e01b81526004016105cc9061227e565b600061099d6080860186611f01565b90506001600160401b038111156109b6576109b66119fd565b6040519080825280602002602001820160405280156109df578160200160208202803683370190505b50905060005b6109f26080870187611f01565b9050811015610c62576000610a0a6080880188611f01565b83818110610a1a57610a1a611eeb565b9050602002810190610a2c9190611f5d565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092018290525093945050508382039050610abf5787356020890135610a8160608b0160408c01611c3b565b610a8e60608c018c611f5d565b604051602001610aa29594939291906122b1565b604051602081830303815290604052805190602001209050610b22565b610acc6080890189611f01565b610ad76001866122f7565b818110610ae657610ae6611eeb565b9050602002810190610af89190611f5d565b604051602001610b0992919061230a565b6040516020818303038152906040528051906020012090505b6000610b3783610b3184611429565b90611459565b9050610b5c81878681518110610b4f57610b4f611eeb565b6020026020010151610473565b610b7957604051632022058360e01b81526004016105cc90612343565b83600003610baf576001600160a01b0381163314610baa57604051632022058360e01b81526004016105cc90612394565b610c19565b60005b84811015610c1757816001600160a01b0316868281518110610bd657610bd6611eeb565b60200260200101516001600160a01b031603610c0557604051632022058360e01b81526004016105cc906123d8565b80610c0f81611ff5565b915050610bb2565b505b80858581518110610c2c57610c2c611eeb565b60200260200101906001600160a01b031690816001600160a01b0316815250505050508080610c5a90611ff5565b9150506109e5565b50949350505050565b6000546001600160a01b03163314610c8257600080fd5b6002805460ff191660011790556040517f9e87fac88ff661f02d44f95383c817fece4bce600a3dab7a54406878b965e75290600090a1565b600081815260056020908152604091829020805483518184028101840190945280845260609392830182828015610d3d57602002820191906000526020600020906000905b82829054906101000a900460c01b6001600160c01b03191681526020019060080190602082600701049283019260010382029150808411610cff5790505b50505050509050919050565b6060610d5361147d565b60025460ff1615610db357610d6b6060830183611f5d565b610d7a91600491600091612148565b610d8391612178565b6001600160e01b031916638456cb5960e01b03610db357604051632022058360e01b81526004016105cc90612413565b610dbe826001610799565b50600080610dd26060850160408601611c3b565b6001600160a01b031634610de96060870187611f5d565b604051610df7929190611fd2565b60006040518083038185875af1925050503d8060008114610e34576040519150601f19603f3d011682016040523d82523d6000602084013e610e39565b606091505b509150915081610e6d578051600003610e65576040516330f4936760e21b81526004016105cc90612457565b805181602001fd5b600160076000610e806080880188611f01565b6000818110610e9157610e91611eeb565b9050602002810190610ea39190611f5d565b604051610eb1929190611fd2565b60408051918290039091208252602082019290925201600020805460ff1916911515919091179055600180559150610ee69050565b919050565b600054600160a81b900460ff1615808015610f1357506000546001600160a01b90910460ff16105b80610f345750303b158015610f345750600054600160a01b900460ff166001145b610f505760405162461bcd60e51b81526004016105cc906124b2565b6000805460ff60a01b1916600160a01b1790558015610f7d576000805460ff60a81b1916600160a81b1790555b600080546001600160a01b031916301790556040861115610fb1576040516330f4936760e21b81526004016105cc9061206b565b610fbd60038888611672565b507fdc3627b8a50594a2c055615b1dd1ef69f5dc80de35b405d1550f8bc7276e71ee8787604051610fef9291906120b7565b60405180910390a16110528585808060200260200160405190810160405280939291908181526020016000905b8282101561104857611039604083028601368190038101906124c2565b8152602001906001019061101c565b5050505050611366565b61109e6b61646d696e2d706f6c69637960a01b8484808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506111ba92505050565b6110bf30635e7c67db60e01b6b61646d696e2d706f6c69637960a01b6112f6565b6110e0306367eae18b60e01b6b61646d696e2d706f6c69637960a01b6112f6565b6111013063101970f760e01b6b61646d696e2d706f6c69637960a01b6112f6565b6111223063167e793960e11b6b61646d696e2d706f6c69637960a01b6112f6565b61114330638456cb5960e01b6b61646d696e2d706f6c69637960a01b6112f6565b61116430631fa5d41d60e11b6b61646d696e2d706f6c69637960a01b6112f6565b80156111b1576000805460ff60a81b191690556040517f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498906111a8906001906124f7565b60405180910390a15b50505050505050565b816111d8576040516330f4936760e21b81526004016105cc9061252b565b60008281526005602052604090205415611205576040516330f4936760e21b81526004016105cc90612566565b8051600003611227576040516330f4936760e21b81526004016105cc906125a3565b60006112316114a6565b905060005b8251811015611298578183828151811061125257611252611eeb565b60200260200101511683828151811061126d5761126d611eeb565b6001600160c01b0319909216602092830291909101909101528061129081611ff5565b915050611236565b50600083815260056020908152604090912083516112b8928501906116bd565b50827f1c28460e7353d1f76d93ce571bb7bf39c569b19a4c9b2a4c1d7f2c9c95f4c0da836040516112e99190611c23565b60405180910390a2505050565b6001600160a01b03831660008181526006602090815260408083206001600160e01b03198716845290915290819020839055518291907fba1ec2dff55a4b0931cf9207c31d493bd27e678b2e15d806c497b820c4dcaeeb906113599086906125c3565b60405180910390a3505050565b60006113706114a6565b905060005b82518110156113f957600083828151811061139257611392611eeb565b602090810291909101810151808201805186166001600160c01b0319811690915290516001600160a01b0316600090815260049092526040909120805467ffffffffffffffff191660c09290921c91909117905550806113f181611ff5565b915050611375565b507f12a11ba4a0395b9f775a0cdac6c1a44182322f4a2892f95922fdc1479cfc02c88260405161065a919061264d565b60008160405160200161143c919061265e565b604051602081830303815290604052805190602001209050919050565b600080600061146885856114c7565b915091506114758161150c565b509392505050565b60026001540361149f5760405162461bcd60e51b81526004016105cc906126cd565b6002600155565b6003546000906114b79060406122f7565b6001600160c01b0319901c919050565b60008082516041036114fd5760208301516040840151606085015160001a6114f1878285856115bb565b94509450505050611505565b506000905060025b9250929050565b6000816004811115611520576115206126dd565b036115285750565b600181600481111561153c5761153c6126dd565b036115595760405162461bcd60e51b81526004016105cc90612727565b600281600481111561156d5761156d6126dd565b0361158a5760405162461bcd60e51b81526004016105cc9061276b565b600381600481111561159e5761159e6126dd565b036106865760405162461bcd60e51b81526004016105cc906127ba565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156115f25750600090506003611669565b60006001878787876040516000815260200160405260405161161794939291906127d3565b6020604051602081039080840390855afa158015611639573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661166257600060019250925050611669565b9150600090505b94509492505050565b8280548282559060005260206000209081019282156116ad579160200282015b828111156116ad578235825591602001919060010190611692565b506116b9929150611766565b5090565b828054828255906000526020600020906003016004900481019282156116ad5791602002820160005b8382111561172a57835183826101000a8154816001600160401b03021916908360c01c021790555092602001926008016020816007010492830192600103026116e6565b801561175d5782816101000a8154906001600160401b03021916905560080160208160070104928301926001030261172a565b50506116b99291505b5b808211156116b95760008155600101611767565b805b811461068657600080fd5b80356104aa8161177b565b60008083601f8401126117a8576117a8600080fd5b5081356001600160401b038111156117c2576117c2600080fd5b60208301915083602082028301111561150557611505600080fd5b6000806000604084860312156117f5576117f5600080fd5b60006118018686611788565b93505060208401356001600160401b0381111561182057611820600080fd5b61182c86828701611793565b92509250509250925092565b60006020828403121561184d5761184d600080fd5b60006118598484611788565b949350505050565b8015155b82525050565b602081016104aa8284611861565b60006001600160a01b0382166104aa565b61177d81611879565b80356104aa8161188a565b6001600160e01b0319811661177d565b80356104aa8161189e565b6000806000606084860312156118d1576118d1600080fd5b60006118dd8686611893565b93505060206118ee868287016118ae565b92505060406118ff86828701611788565b9150509250925092565b6001600160c01b0319811661177d565b80356104aa81611909565b6000806040838503121561193a5761193a600080fd5b60006119468585611893565b925050602061195785828601611919565b9150509250929050565b600060a0828403121561197657611976600080fd5b50919050565b60006020828403121561199157611991600080fd5b81356001600160401b038111156119aa576119aa600080fd5b61185984828501611961565b600080602083850312156119cc576119cc600080fd5b82356001600160401b038111156119e5576119e5600080fd5b6119f185828601611793565b92509250509250929050565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b0382111715611a3857611a386119fd565b6040525050565b6000611a4a60405190565b9050610ee68282611a13565b60006001600160401b03821115611a6f57611a6f6119fd565b5060209081020190565b600060408284031215611a8e57611a8e600080fd5b611a986040611a3f565b90506000611aa68484611893565b8252506020611ab784848301611919565b60208301525092915050565b6000611ad6611ad184611a56565b611a3f565b83815290506020810160408402830185811115611af557611af5600080fd5b835b81811015611b1b5780611b0a8882611a79565b845250602090920191604001611af7565b5050509392505050565b600082601f830112611b3957611b39600080fd5b8135611859848260208601611ac3565b600060208284031215611b5e57611b5e600080fd5b81356001600160401b03811115611b7757611b77600080fd5b61185984828501611b25565b60008060408385031215611b9957611b99600080fd5b6000611ba58585611893565b9250506020611957858286016118ae565b6001600160c01b03198116611865565b6000611bd28383611bb6565b505060200190565b6000611be4825190565b80845260209384019383018060005b83811015611c18578151611c078882611bc6565b975060208301925050600101611bf3565b509495945050505050565b60208082528101611c348184611bda565b9392505050565b600060208284031215611c5057611c50600080fd5b60006118598484611893565b602081016104aa8284611bb6565b80611865565b6000611bd28383611c6a565b6000611c86825190565b80845260209384019383018060005b83811015611c18578151611ca98882611c70565b975060208301925050600101611c95565b60208082528101611c348184611c7c565b80151561177d565b80356104aa81611ccb565b60008060408385031215611cf457611cf4600080fd5b82356001600160401b03811115611d0d57611d0d600080fd5b611d1985828601611961565b925050602061195785828601611cd3565b61186581611879565b6000611bd28383611d2a565b6000611d49825190565b80845260209384019383018060005b83811015611c18578151611d6c8882611d33565b975060208301925050600101611d58565b60208082528101611c348184611d3f565b60005b83811015611da9578181015183820152602001611d91565b50506000910152565b6000611dbc825190565b808452602084019350611dd3818560208601611d8e565b601f19601f8201165b9093019392505050565b60208082528101611c348184611db2565b60008083601f840112611e0c57611e0c600080fd5b5081356001600160401b03811115611e2657611e26600080fd5b60208301915083604082028301111561150557611505600080fd5b60008060008060008060608789031215611e5d57611e5d600080fd5b86356001600160401b03811115611e7657611e76600080fd5b611e8289828a01611793565b965096505060208701356001600160401b03811115611ea357611ea3600080fd5b611eaf89828a01611df7565b945094505060408701356001600160401b03811115611ed057611ed0600080fd5b611edc89828a01611793565b92509250509295509295509295565b634e487b7160e01b600052603260045260246000fd5b6000808335601e1936859003018112611f1c57611f1c600080fd5b8084019250823591506001600160401b03821115611f3c57611f3c600080fd5b60209283019282023603831315611f5557611f55600080fd5b509250929050565b6000808335601e1936859003018112611f7857611f78600080fd5b8084019250823591506001600160401b03821115611f9857611f98600080fd5b602083019250600182023603831315611f5557611f55600080fd5b82818337506000910152565b6000611fcc838584611fb3565b50500190565b6000611859828486611fbf565b634e487b7160e01b600052601160045260246000fd5b6000600019820361200857612008611fdf565b5060010190565b808201808211156104aa576104aa611fdf565b602981526000602082017f54686520536869656c642063616e6e6f742068617665206d6f7265207468616e81526820363420726f6c657360b81b602082015291505b5060400190565b602080825281016104aa81612022565b82818337505050565b81835260006020840193506001600160fb1b038311156120a6576120a6600080fd5b602083029250611fcc83858461207b565b60208082528101611859818486612084565b6011815260006020820170086d0c2d2dc40928840dad2e6dac2e8c6d607b1b815291505b5060200190565b602080825281016104aa816120c9565b601981526000602082017f417070726f76616c732063616e6e6f7420626520656d70747900000000000000815291506120ed565b602080825281016104aa81612104565b6000808585111561215b5761215b600080fd5b8386111561216b5761216b600080fd5b5050820193919092039150565b80356001600160e01b031916828260048210156121ab576121a66001600160e01b0319836004036008021b90565b831692505b505092915050565b601e81526000602082017f43726564656e7469616c732068617665206265656e2063616e63656c65640000815291506120ed565b602080825281016104aa816121b3565b602681526000602082017f43726564656e7469616c732068617665206265656e20657865637574656420618152656c726561647960d01b60208201529150612064565b602080825281016104aa816121f7565b601d81526000602082017f496e636f7272656374206e756d626572206f6620617070726f76616c73000000815291506120ed565b602080825281016104aa8161224a565b81835260006020840193506122a4838584611fb3565b601f19601f840116611ddc565b608081016122bf8288611c6a565b6122cc6020830187611c6a565b6122d96040830186611d2a565b81810360608301526122ec81848661228e565b979650505050505050565b818103818111156104aa576104aa611fdf565b6020808252810161185981848661228e565b601081526000602082016f2837b634b1bc903b34b7b630ba34b7b760811b815291506120ed565b602080825281016104aa8161231c565b602481526000602082017f546865206f776e6572206d75737420626520746865206669727374206170707281526337bb32b960e11b60208201529150612064565b602080825281016104aa81612353565b601e81526000602082017f53616d6520616464726573732063616e6e6f74207369676e2074776963650000815291506120ed565b602080825281016104aa816123a4565b6014815260006020820173151a194814da1a595b19081a5cc81c185d5cd95960621b815291506120ed565b602080825281016104aa816123e8565b601b81526000602082017f63726564656e7469616c7320657865637574696f6e206572726f720000000000815291506120ed565b602080825281016104aa81612423565b602e81526000602082017f496e697469616c697a61626c653a20636f6e747261637420697320616c72656181526d191e481a5b9a5d1a585b1a5e995960921b60208201529150612064565b602080825281016104aa81612467565b6000604082840312156124d7576124d7600080fd5b60006118598484611a79565b600060ff82166104aa565b611865816124e3565b602081016104aa82846124ee565b600f81526000602082016e155b9919599a5b9959081b1858995b608a1b815291506120ed565b602080825281016104aa81612505565b60148152600060208201734c6162656c20616c72656164792065786973747360601b815291506120ed565b602080825281016104aa8161253b565b6016815260006020820175506f6c6963792063616e6e6f7420626520656d70747960501b815291506120ed565b602080825281016104aa81612576565b6001600160e01b03198116611865565b602081016104aa82846125b3565b805160408301906125e28482611d2a565b5060208201516125f56020850182611bb6565b50505050565b600061260783836125d1565b505060400190565b6000612619825190565b80845260209384019383018060005b83811015611c1857815161263c88826125fb565b975060208301925050600101612628565b60208082528101611c34818461260f565b7f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152601c0160006126908284611c6a565b50602001919050565b601f81526000602082017f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00815291506120ed565b602080825281016104aa81612699565b634e487b7160e01b600052602160045260246000fd5b601881526000602082017f45434453413a20696e76616c6964207369676e61747572650000000000000000815291506120ed565b602080825281016104aa816126f3565b601f81526000602082017f45434453413a20696e76616c6964207369676e6174757265206c656e67746800815291506120ed565b602080825281016104aa81612737565b602281526000602082017f45434453413a20696e76616c6964207369676e6174757265202773272076616c815261756560f01b60208201529150612064565b602080825281016104aa8161277b565b60ff8116611865565b608081016127e18287611c6a565b6127ee60208301866127ca565b6127fb6040830185611c6a565b6128086060830184611c6a565b9594505050505056fea264697066735822122057fc5061c1b10374c9e44f898732c74570c15219d6737bef87094063c3bd5d5664736f6c63430008110033";

type ShieldConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ShieldConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Shield__factory extends ContractFactory {
  constructor(...args: ShieldConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Shield> {
    return super.deploy(overrides || {}) as Promise<Shield>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Shield {
    return super.attach(address) as Shield;
  }
  override connect(signer: Signer): Shield__factory {
    return super.connect(signer) as Shield__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ShieldInterface {
    return new utils.Interface(_abi) as ShieldInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Shield {
    return new Contract(address, _abi, signerOrProvider) as Shield;
  }
}
