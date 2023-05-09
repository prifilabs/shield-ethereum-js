/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERC1155,
  ERC1155Interface,
} from "../../../../../@openzeppelin/contracts/token/ERC1155/ERC1155";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "uri_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200192c3803806200192c833981016040819052620000349162000188565b6200003f8162000046565b5062000397565b6002620000548282620002c7565b5050565b634e487b7160e01b600052604160045260246000fd5b601f19601f83011681018181106001600160401b038211171562000096576200009662000058565b6040525050565b6000620000a960405190565b9050620000b782826200006e565b919050565b60006001600160401b03821115620000d857620000d862000058565b601f19601f83011660200192915050565b60005b8381101562000106578181015183820152602001620000ec565b50506000910152565b6000620001266200012084620000bc565b6200009d565b905082815260208101848484011115620001435762000143600080fd5b62000150848285620000e9565b509392505050565b600082601f8301126200016e576200016e600080fd5b8151620001808482602086016200010f565b949350505050565b6000602082840312156200019f576200019f600080fd5b81516001600160401b03811115620001ba57620001ba600080fd5b620001808482850162000158565b634e487b7160e01b600052602260045260246000fd5b600281046001821680620001f357607f821691505b602082108103620002085762000208620001c8565b50919050565b60006200021f6200021c8381565b90565b92915050565b62000230836200020e565b81546008840282811b60001990911b908116901990911617825550505050565b60006200025f81848462000225565b505050565b8181101562000054576200027a60008262000250565b60010162000264565b601f8211156200025f576000818152602090206020601f85010481016020851015620002ac5750805b620002c06020601f86010483018262000264565b5050505050565b81516001600160401b03811115620002e357620002e362000058565b620002ef8254620001de565b620002fc82828562000283565b6020601f8311600181146200033357600084156200031a5750858201515b600019600886021c19811660028602178655506200038f565b600085815260208120601f198616915b8281101562000365578885015182556020948501946001909201910162000343565b86831015620003825784890151600019601f89166008021c191682555b6001600288020188555050505b505050505050565b61158580620003a76000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461017957600080fd5b8062fdd58e1461008c57806301ffc9a7146100b55780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004610a27565b61018c565b6040516100ac9190610a6c565b60405180910390f35b6100c86100c3366004610a95565b6101e6565b6040516100ac9190610ac6565b6100e86100e3366004610ad4565b610236565b6040516100ac9190610b4b565b610108610103366004610cf9565b6102ca565b005b61011d610118366004610e37565b610316565b6040516100ac9190610efc565b610108610138366004610f20565b6103fe565b6100c861014b366004610f53565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b610108610187366004610f86565b61040d565b60006001600160a01b0383166101bd5760405162461bcd60e51b81526004016101b49061102a565b60405180910390fd5b506000818152602081815260408083206001600160a01b03861684529091529020545b92915050565b60006001600160e01b03198216636cdb3d1360e11b148061021757506001600160e01b031982166303a24d0760e21b145b806101e057506301ffc9a760e01b6001600160e01b03198316146101e0565b60606002805461024590611050565b80601f016020809104026020016040519081016040528092919081815260200182805461027190611050565b80156102be5780601f10610293576101008083540402835291602001916102be565b820191906000526020600020905b8154815290600101906020018083116102a157829003601f168201915b50505050509050919050565b6001600160a01b0385163314806102e657506102e6853361014b565b6103025760405162461bcd60e51b81526004016101b4906110c7565b61030f8585858585610452565b5050505050565b606081518351146103395760405162461bcd60e51b81526004016101b49061111d565b6000835167ffffffffffffffff81111561035557610355610b63565b60405190808252806020026020018201604052801561037e578160200160208202803683370190505b50905060005b84518110156103f6576103c98582815181106103a2576103a261112d565b60200260200101518583815181106103bc576103bc61112d565b602002602001015161018c565b8282815181106103db576103db61112d565b60209081029190910101526103ef81611159565b9050610384565b509392505050565b6104093383836105ee565b5050565b6001600160a01b0385163314806104295750610429853361014b565b6104455760405162461bcd60e51b81526004016101b4906110c7565b61030f8585858585610690565b81518351146104735760405162461bcd60e51b81526004016101b4906111b8565b6001600160a01b0384166104995760405162461bcd60e51b81526004016101b49061120a565b3360005b84518110156105805760008582815181106104ba576104ba61112d565b6020026020010151905060008583815181106104d8576104d861112d565b602090810291909101810151600084815280835260408082206001600160a01b038e1683529093529190912054909150818110156105285760405162461bcd60e51b81526004016101b490611261565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610565908490611271565b925050819055505050508061057990611159565b905061049d565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516105d0929190611284565b60405180910390a46105e68187878787876107c6565b505050505050565b816001600160a01b0316836001600160a01b03160361061f5760405162461bcd60e51b81526004016101b4906112ef565b6001600160a01b0383811660008181526001602090815260408083209487168084529490915290819020805460ff1916851515179055517f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3190610683908590610ac6565b60405180910390a3505050565b6001600160a01b0384166106b65760405162461bcd60e51b81526004016101b49061120a565b3360006106c2856108dd565b905060006106cf856108dd565b90506000868152602081815260408083206001600160a01b038c168452909152902054858110156107125760405162461bcd60e51b81526004016101b490611261565b6000878152602081815260408083206001600160a01b038d8116855292528083208985039055908a1682528120805488929061074f908490611271565b92505081905550876001600160a01b0316896001600160a01b0316856001600160a01b03167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a6040516107a59291906112ff565b60405180910390a46107bb848a8a8a8a8a610928565b505050505050505050565b6001600160a01b0384163b156105e65760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061080a9089908990889088908890600401611323565b6020604051808303816000875af1925050508015610845575060408051601f3d908101601f191682019092526108429181019061138e565b60015b6108a4576108516113af565b806308c379a00361088a57506108656113cb565b80610870575061088c565b8060405162461bcd60e51b81526004016101b49190610b4b565b505b60405162461bcd60e51b81526004016101b4906114a3565b6001600160e01b0319811663bc197c8160e01b146108d45760405162461bcd60e51b81526004016101b4906114f8565b50505050505050565b604080516001808252818301909252606091600091906020808301908036833701905050905082816000815181106109175761091761112d565b602090810291909101015292915050565b6001600160a01b0384163b156105e65760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e619061096c9089908990889088908890600401611508565b6020604051808303816000875af19250505080156109a7575060408051601f3d908101601f191682019092526109a49181019061138e565b60015b6109b3576108516113af565b6001600160e01b0319811663f23a6e6160e01b146108d45760405162461bcd60e51b81526004016101b4906114f8565b60006001600160a01b0382166101e0565b6109fd816109e3565b8114610a0857600080fd5b50565b80356101e0816109f4565b806109fd565b80356101e081610a16565b60008060408385031215610a3d57610a3d600080fd5b6000610a498585610a0b565b9250506020610a5a85828601610a1c565b9150509250929050565b805b82525050565b602081016101e08284610a64565b6001600160e01b031981166109fd565b80356101e081610a7a565b600060208284031215610aaa57610aaa600080fd5b6000610ab68484610a8a565b949350505050565b801515610a66565b602081016101e08284610abe565b600060208284031215610ae957610ae9600080fd5b6000610ab68484610a1c565b60005b83811015610b10578181015183820152602001610af8565b50506000910152565b6000610b23825190565b808452602084019350610b3a818560208601610af5565b601f01601f19169290920192915050565b60208082528101610b5c8184610b19565b9392505050565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff82111715610b9f57610b9f610b63565b6040525050565b6000610bb160405190565b9050610bbd8282610b79565b919050565b600067ffffffffffffffff821115610bdc57610bdc610b63565b5060209081020190565b6000610bf9610bf484610bc2565b610ba6565b83815290506020808201908402830185811115610c1857610c18600080fd5b835b81811015610c3c5780610c2d8882610a1c565b84525060209283019201610c1a565b5050509392505050565b600082601f830112610c5a57610c5a600080fd5b8135610ab6848260208601610be6565b600067ffffffffffffffff821115610c8457610c84610b63565b601f19601f83011660200192915050565b82818337506000910152565b6000610caf610bf484610c6a565b905082815260208101848484011115610cca57610cca600080fd5b6103f6848285610c95565b600082601f830112610ce957610ce9600080fd5b8135610ab6848260208601610ca1565b600080600080600060a08688031215610d1457610d14600080fd5b6000610d208888610a0b565b9550506020610d3188828901610a0b565b945050604086013567ffffffffffffffff811115610d5157610d51600080fd5b610d5d88828901610c46565b935050606086013567ffffffffffffffff811115610d7d57610d7d600080fd5b610d8988828901610c46565b925050608086013567ffffffffffffffff811115610da957610da9600080fd5b610db588828901610cd5565b9150509295509295909350565b6000610dd0610bf484610bc2565b83815290506020808201908402830185811115610def57610def600080fd5b835b81811015610c3c5780610e048882610a0b565b84525060209283019201610df1565b600082601f830112610e2757610e27600080fd5b8135610ab6848260208601610dc2565b60008060408385031215610e4d57610e4d600080fd5b823567ffffffffffffffff811115610e6757610e67600080fd5b610e7385828601610e13565b925050602083013567ffffffffffffffff811115610e9357610e93600080fd5b610a5a85828601610c46565b6000610eab8383610a64565b505060200190565b6000610ebd825190565b80845260209384019383018060005b83811015610ef1578151610ee08882610e9f565b975060208301925050600101610ecc565b509495945050505050565b60208082528101610b5c8184610eb3565b8015156109fd565b80356101e081610f0d565b60008060408385031215610f3657610f36600080fd5b6000610f428585610a0b565b9250506020610a5a85828601610f15565b60008060408385031215610f6957610f69600080fd5b6000610f758585610a0b565b9250506020610a5a85828601610a0b565b600080600080600060a08688031215610fa157610fa1600080fd5b6000610fad8888610a0b565b9550506020610fbe88828901610a0b565b9450506040610fcf88828901610a1c565b9350506060610d8988828901610a1c565b602a81526000602082017f455243313135353a2061646472657373207a65726f206973206e6f742061207681526930b634b21037bbb732b960b11b602082015291505b5060400190565b602080825281016101e081610fe0565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061106457607f821691505b6020821081036110765761107661103a565b50919050565b602e81526000602082017f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e81526d195c881bdc88185c1c1c9bdd995960921b60208201529150611023565b602080825281016101e08161107c565b602981526000602082017f455243313135353a206163636f756e747320616e6420696473206c656e677468815268040dad2e6dac2e8c6d60bb1b60208201529150611023565b602080825281016101e0816110d7565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019820361116c5761116c611143565b5060010190565b602881526000602082017f455243313135353a2069647320616e6420616d6f756e7473206c656e677468208152670dad2e6dac2e8c6d60c31b60208201529150611023565b602080825281016101e081611173565b602581526000602082017f455243313135353a207472616e7366657220746f20746865207a65726f206164815264647265737360d81b60208201529150611023565b602080825281016101e0816111c8565b602a81526000602082017f455243313135353a20696e73756666696369656e742062616c616e636520666f81526939103a3930b739b332b960b11b60208201529150611023565b602080825281016101e08161121a565b808201808211156101e0576101e0611143565b604080825281016112958185610eb3565b90508181036020830152610ab68184610eb3565b602981526000602082017f455243313135353a2073657474696e6720617070726f76616c20737461747573815268103337b91039b2b63360b91b60208201529150611023565b602080825281016101e0816112a9565b6040810161130d8285610a64565b610b5c6020830184610a64565b610a66816109e3565b60a08101611331828861131a565b61133e602083018761131a565b81810360408301526113508186610eb3565b905081810360608301526113648185610eb3565b905081810360808301526113788184610b19565b979650505050505050565b80516101e081610a7a565b6000602082840312156113a3576113a3600080fd5b6000610ab68484611383565b600060033d11156113c85760046000803e5060005160e01c5b90565b600060443d10156113d95790565b60405160043d036004823e80513d602482011167ffffffffffffffff8211171561140257505090565b808201805167ffffffffffffffff81111561141e575050505090565b80602083010160043d03850181111561143957505050505090565b61144882602001850186610b79565b5090949350505050565b603481526000602082017f455243313135353a207472616e7366657220746f206e6f6e2d455243313135358152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60208201529150611023565b602080825281016101e081611452565b602881526000602082017f455243313135353a204552433131353552656365697665722072656a656374658152676420746f6b656e7360c01b60208201529150611023565b602080825281016101e0816114b3565b60a08101611516828861131a565b611523602083018761131a565b6115306040830186610a64565b61153d6060830185610a64565b81810360808301526113788184610b1956fea2646970667358221220a9e0f759d3edefd8d65231267d7ccbf1c1c90c16f9ca1b57586d16e13fcba78064736f6c63430008110033";

type ERC1155ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155__factory extends ContractFactory {
  constructor(...args: ERC1155ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    uri_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155> {
    return super.deploy(uri_, overrides || {}) as Promise<ERC1155>;
  }
  override getDeployTransaction(
    uri_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(uri_, overrides || {});
  }
  override attach(address: string): ERC1155 {
    return super.attach(address) as ERC1155;
  }
  override connect(signer: Signer): ERC1155__factory {
    return super.connect(signer) as ERC1155__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155Interface {
    return new utils.Interface(_abi) as ERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155 {
    return new Contract(address, _abi, signerOrProvider) as ERC1155;
  }
}
