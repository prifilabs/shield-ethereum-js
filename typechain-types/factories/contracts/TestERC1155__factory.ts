/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TestERC1155,
  TestERC1155Interface,
} from "../../contracts/TestERC1155";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
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
    inputs: [],
    name: "GOLD",
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
  "0x60806040523480156200001157600080fd5b5060405162001ebe38038062001ebe833981016040819052620000349162000386565b60408051808201909152601e81527f68747470733a2f2f67616d652e6578616d706c652f6170692f6974656d2f000060208201526200007381620000a0565b5062000099816000600560405180602001604052806000815250620000b260201b60201c565b5062000907565b6002620000ae8282620004c2565b5050565b6001600160a01b038416620000e45760405162461bcd60e51b8152600401620000db90620005d2565b60405180910390fd5b336000620000f285620001b0565b905060006200010185620001b0565b90506000868152602081815260408083206001600160a01b038b1684529091528120805487929062000135908490620005fa565b92505081905550866001600160a01b031660006001600160a01b0316846001600160a01b03167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6289896040516200018e92919062000618565b60405180910390a4620001a78360008989898962000206565b50505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110620001ed57620001ed6200063e565b602090810291909101015292915050565b505050505050565b62000225846001600160a01b03166200033d60201b620004651760201c565b15620001fe5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190620002619089908990889088908890600401620006ba565b6020604051808303816000875af19250505080156200029f575060408051601f3d908101601f191682019092526200029c9181019062000734565b60015b6200030a57620002ae62000759565b806308c379a003620002ee5750620002c5620007a4565b80620002d25750620002f0565b8060405162461bcd60e51b8152600401620000db91906200082f565b505b60405162461bcd60e51b8152600401620000db906200089d565b6001600160e01b0319811663f23a6e6160e01b14620001a75760405162461bcd60e51b8152600401620000db90620008f5565b6001600160a01b03163b151590565b60006001600160a01b0382165b92915050565b6200036a816200034c565b81146200037657600080fd5b50565b805162000359816200035f565b6000602082840312156200039d576200039d600080fd5b6000620003ab848462000379565b949350505050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052602260045260246000fd5b600281046001821680620003f457607f821691505b602082108103620004095762000409620003c9565b50919050565b6000620003596200041d8381565b90565b6200042b836200040f565b81546008840282811b60001990911b908116901990911617825550505050565b60006200045a81848462000420565b505050565b81811015620000ae57620004756000826200044b565b6001016200045f565b601f8211156200045a576000818152602090206020601f85010481016020851015620004a75750805b620004bb6020601f8601048301826200045f565b5050505050565b81516001600160401b03811115620004de57620004de620003b3565b620004ea8254620003df565b620004f78282856200047e565b6020601f8311600181146200052e5760008415620005155750858201515b600019600886021c1981166002860217865550620001fe565b600085815260208120601f198616915b828110156200056057888501518255602094850194600190920191016200053e565b868310156200057d5784890151600019601f89166008021c191682555b600160028802018855505050505050505050565b602181526000602082017f455243313135353a206d696e7420746f20746865207a65726f206164647265738152607360f81b602082015291505b5060400190565b60208082528101620003598162000591565b634e487b7160e01b600052601160045260246000fd5b80820180821115620003595762000359620005e4565b805b82525050565b6040810162000628828562000610565b62000637602083018462000610565b9392505050565b634e487b7160e01b600052603260045260246000fd5b62000612816200034c565b60005b838110156200067c57818101518382015260200162000662565b50506000910152565b600062000690825190565b808452602084019350620006a98185602086016200065f565b601f01601f19169290920192915050565b60a08101620006ca828862000654565b620006d9602083018762000654565b620006e8604083018662000610565b620006f7606083018562000610565b81810360808301526200070b818462000685565b979650505050505050565b6001600160e01b031981166200036a565b8051620003598162000716565b6000602082840312156200074b576200074b600080fd5b6000620003ab848462000727565b600060033d11156200041d5760046000803e5060005160e01c90565b601f19601f83011681018181106001600160401b03821117156200079d576200079d620003b3565b6040525050565b600060443d1015620007b35790565b60405160043d036004823e80513d60248201116001600160401b0382111715620007dc57505090565b80820180516001600160401b03811115620007f8575050505090565b80602083010160043d0385018111156200081457505050505090565b620008258260200185018662000775565b5090949350505050565b6020808252810162000637818462000685565b603481526000602082017f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353581527f526563656976657220696d706c656d656e74657200000000000000000000000060208201529150620005cb565b60208082528101620003598162000842565b602881526000602082017f455243313135353a204552433131353552656365697665722072656a656374658152676420746f6b656e7360c01b60208201529150620005cb565b602080825281016200035981620008af565b6115a780620009176000396000f3fe608060405234801561001057600080fd5b50600436106100925760003560e01c80633e4bee38116100665780633e4bee38146101155780634e1273f41461011d578063a22cb4651461013d578063e985e9c514610150578063f242432a1461018c57600080fd5b8062fdd58e1461009757806301ffc9a7146100c05780630e89341c146100e05780632eb2c2d614610100575b600080fd5b6100aa6100a5366004610a49565b61019f565b6040516100b79190610a8e565b60405180910390f35b6100d36100ce366004610ab7565b6101f9565b6040516100b79190610ae8565b6100f36100ee366004610af6565b610249565b6040516100b79190610b6d565b61011361010e366004610d1b565b6102dd565b005b6100aa600081565b61013061012b366004610e59565b610329565b6040516100b79190610f1e565b61011361014b366004610f42565b610411565b6100d361015e366004610f75565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b61011361019a366004610fa8565b610420565b60006001600160a01b0383166101d05760405162461bcd60e51b81526004016101c79061104c565b60405180910390fd5b506000818152602081815260408083206001600160a01b03861684529091529020545b92915050565b60006001600160e01b03198216636cdb3d1360e11b148061022a57506001600160e01b031982166303a24d0760e21b145b806101f357506301ffc9a760e01b6001600160e01b03198316146101f3565b60606002805461025890611072565b80601f016020809104026020016040519081016040528092919081815260200182805461028490611072565b80156102d15780601f106102a6576101008083540402835291602001916102d1565b820191906000526020600020905b8154815290600101906020018083116102b457829003601f168201915b50505050509050919050565b6001600160a01b0385163314806102f957506102f9853361015e565b6103155760405162461bcd60e51b81526004016101c7906110e9565b6103228585858585610474565b5050505050565b6060815183511461034c5760405162461bcd60e51b81526004016101c79061113f565b6000835167ffffffffffffffff81111561036857610368610b85565b604051908082528060200260200182016040528015610391578160200160208202803683370190505b50905060005b8451811015610409576103dc8582815181106103b5576103b561114f565b60200260200101518583815181106103cf576103cf61114f565b602002602001015161019f565b8282815181106103ee576103ee61114f565b60209081029190910101526104028161117b565b9050610397565b509392505050565b61041c338383610610565b5050565b6001600160a01b03851633148061043c575061043c853361015e565b6104585760405162461bcd60e51b81526004016101c7906110e9565b61032285858585856106b2565b6001600160a01b03163b151590565b81518351146104955760405162461bcd60e51b81526004016101c7906111da565b6001600160a01b0384166104bb5760405162461bcd60e51b81526004016101c79061122c565b3360005b84518110156105a25760008582815181106104dc576104dc61114f565b6020026020010151905060008583815181106104fa576104fa61114f565b602090810291909101810151600084815280835260408082206001600160a01b038e16835290935291909120549091508181101561054a5760405162461bcd60e51b81526004016101c790611283565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610587908490611293565b925050819055505050508061059b9061117b565b90506104bf565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516105f29291906112a6565b60405180910390a46106088187878787876107e8565b505050505050565b816001600160a01b0316836001600160a01b0316036106415760405162461bcd60e51b81526004016101c790611311565b6001600160a01b0383811660008181526001602090815260408083209487168084529490915290819020805460ff1916851515179055517f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31906106a5908590610ae8565b60405180910390a3505050565b6001600160a01b0384166106d85760405162461bcd60e51b81526004016101c79061122c565b3360006106e4856108ff565b905060006106f1856108ff565b90506000868152602081815260408083206001600160a01b038c168452909152902054858110156107345760405162461bcd60e51b81526004016101c790611283565b6000878152602081815260408083206001600160a01b038d8116855292528083208985039055908a16825281208054889290610771908490611293565b92505081905550876001600160a01b0316896001600160a01b0316856001600160a01b03167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a6040516107c7929190611321565b60405180910390a46107dd848a8a8a8a8a61094a565b505050505050505050565b6001600160a01b0384163b156106085760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061082c9089908990889088908890600401611345565b6020604051808303816000875af1925050508015610867575060408051601f3d908101601f19168201909252610864918101906113b0565b60015b6108c6576108736113d1565b806308c379a0036108ac57506108876113ed565b8061089257506108ae565b8060405162461bcd60e51b81526004016101c79190610b6d565b505b60405162461bcd60e51b81526004016101c7906114c5565b6001600160e01b0319811663bc197c8160e01b146108f65760405162461bcd60e51b81526004016101c79061151a565b50505050505050565b604080516001808252818301909252606091600091906020808301908036833701905050905082816000815181106109395761093961114f565b602090810291909101015292915050565b6001600160a01b0384163b156106085760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e619061098e908990899088908890889060040161152a565b6020604051808303816000875af19250505080156109c9575060408051601f3d908101601f191682019092526109c6918101906113b0565b60015b6109d5576108736113d1565b6001600160e01b0319811663f23a6e6160e01b146108f65760405162461bcd60e51b81526004016101c79061151a565b60006001600160a01b0382166101f3565b610a1f81610a05565b8114610a2a57600080fd5b50565b80356101f381610a16565b80610a1f565b80356101f381610a38565b60008060408385031215610a5f57610a5f600080fd5b6000610a6b8585610a2d565b9250506020610a7c85828601610a3e565b9150509250929050565b805b82525050565b602081016101f38284610a86565b6001600160e01b03198116610a1f565b80356101f381610a9c565b600060208284031215610acc57610acc600080fd5b6000610ad88484610aac565b949350505050565b801515610a88565b602081016101f38284610ae0565b600060208284031215610b0b57610b0b600080fd5b6000610ad88484610a3e565b60005b83811015610b32578181015183820152602001610b1a565b50506000910152565b6000610b45825190565b808452602084019350610b5c818560208601610b17565b601f01601f19169290920192915050565b60208082528101610b7e8184610b3b565b9392505050565b634e487b7160e01b600052604160045260246000fd5b601f19601f830116810181811067ffffffffffffffff82111715610bc157610bc1610b85565b6040525050565b6000610bd360405190565b9050610bdf8282610b9b565b919050565b600067ffffffffffffffff821115610bfe57610bfe610b85565b5060209081020190565b6000610c1b610c1684610be4565b610bc8565b83815290506020808201908402830185811115610c3a57610c3a600080fd5b835b81811015610c5e5780610c4f8882610a3e565b84525060209283019201610c3c565b5050509392505050565b600082601f830112610c7c57610c7c600080fd5b8135610ad8848260208601610c08565b600067ffffffffffffffff821115610ca657610ca6610b85565b601f19601f83011660200192915050565b82818337506000910152565b6000610cd1610c1684610c8c565b905082815260208101848484011115610cec57610cec600080fd5b610409848285610cb7565b600082601f830112610d0b57610d0b600080fd5b8135610ad8848260208601610cc3565b600080600080600060a08688031215610d3657610d36600080fd5b6000610d428888610a2d565b9550506020610d5388828901610a2d565b945050604086013567ffffffffffffffff811115610d7357610d73600080fd5b610d7f88828901610c68565b935050606086013567ffffffffffffffff811115610d9f57610d9f600080fd5b610dab88828901610c68565b925050608086013567ffffffffffffffff811115610dcb57610dcb600080fd5b610dd788828901610cf7565b9150509295509295909350565b6000610df2610c1684610be4565b83815290506020808201908402830185811115610e1157610e11600080fd5b835b81811015610c5e5780610e268882610a2d565b84525060209283019201610e13565b600082601f830112610e4957610e49600080fd5b8135610ad8848260208601610de4565b60008060408385031215610e6f57610e6f600080fd5b823567ffffffffffffffff811115610e8957610e89600080fd5b610e9585828601610e35565b925050602083013567ffffffffffffffff811115610eb557610eb5600080fd5b610a7c85828601610c68565b6000610ecd8383610a86565b505060200190565b6000610edf825190565b80845260209384019383018060005b83811015610f13578151610f028882610ec1565b975060208301925050600101610eee565b509495945050505050565b60208082528101610b7e8184610ed5565b801515610a1f565b80356101f381610f2f565b60008060408385031215610f5857610f58600080fd5b6000610f648585610a2d565b9250506020610a7c85828601610f37565b60008060408385031215610f8b57610f8b600080fd5b6000610f978585610a2d565b9250506020610a7c85828601610a2d565b600080600080600060a08688031215610fc357610fc3600080fd5b6000610fcf8888610a2d565b9550506020610fe088828901610a2d565b9450506040610ff188828901610a3e565b9350506060610dab88828901610a3e565b602a81526000602082017f455243313135353a2061646472657373207a65726f206973206e6f742061207681526930b634b21037bbb732b960b11b602082015291505b5060400190565b602080825281016101f381611002565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061108657607f821691505b6020821081036110985761109861105c565b50919050565b602e81526000602082017f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e81526d195c881bdc88185c1c1c9bdd995960921b60208201529150611045565b602080825281016101f38161109e565b602981526000602082017f455243313135353a206163636f756e747320616e6420696473206c656e677468815268040dad2e6dac2e8c6d60bb1b60208201529150611045565b602080825281016101f3816110f9565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019820361118e5761118e611165565b5060010190565b602881526000602082017f455243313135353a2069647320616e6420616d6f756e7473206c656e677468208152670dad2e6dac2e8c6d60c31b60208201529150611045565b602080825281016101f381611195565b602581526000602082017f455243313135353a207472616e7366657220746f20746865207a65726f206164815264647265737360d81b60208201529150611045565b602080825281016101f3816111ea565b602a81526000602082017f455243313135353a20696e73756666696369656e742062616c616e636520666f81526939103a3930b739b332b960b11b60208201529150611045565b602080825281016101f38161123c565b808201808211156101f3576101f3611165565b604080825281016112b78185610ed5565b90508181036020830152610ad88184610ed5565b602981526000602082017f455243313135353a2073657474696e6720617070726f76616c20737461747573815268103337b91039b2b63360b91b60208201529150611045565b602080825281016101f3816112cb565b6040810161132f8285610a86565b610b7e6020830184610a86565b610a8881610a05565b60a08101611353828861133c565b611360602083018761133c565b81810360408301526113728186610ed5565b905081810360608301526113868185610ed5565b9050818103608083015261139a8184610b3b565b979650505050505050565b80516101f381610a9c565b6000602082840312156113c5576113c5600080fd5b6000610ad884846113a5565b600060033d11156113ea5760046000803e5060005160e01c5b90565b600060443d10156113fb5790565b60405160043d036004823e80513d602482011167ffffffffffffffff8211171561142457505090565b808201805167ffffffffffffffff811115611440575050505090565b80602083010160043d03850181111561145b57505050505090565b61146a82602001850186610b9b565b5090949350505050565b603481526000602082017f455243313135353a207472616e7366657220746f206e6f6e2d455243313135358152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60208201529150611045565b602080825281016101f381611474565b602881526000602082017f455243313135353a204552433131353552656365697665722072656a656374658152676420746f6b656e7360c01b60208201529150611045565b602080825281016101f3816114d5565b60a08101611538828861133c565b611545602083018761133c565b6115526040830186610a86565b61155f6060830185610a86565b818103608083015261139a8184610b3b56fea2646970667358221220a8e4f490647e11d6b674c06b3ae0eda173816304c284e38efaeda9dbe1921aa364736f6c63430008110033";

type TestERC1155ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestERC1155ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestERC1155__factory extends ContractFactory {
  constructor(...args: TestERC1155ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    addr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestERC1155> {
    return super.deploy(addr, overrides || {}) as Promise<TestERC1155>;
  }
  override getDeployTransaction(
    addr: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(addr, overrides || {});
  }
  override attach(address: string): TestERC1155 {
    return super.attach(address) as TestERC1155;
  }
  override connect(signer: Signer): TestERC1155__factory {
    return super.connect(signer) as TestERC1155__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestERC1155Interface {
    return new utils.Interface(_abi) as TestERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestERC1155 {
    return new Contract(address, _abi, signerOrProvider) as TestERC1155;
  }
}
