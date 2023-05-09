pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract TestERC1155 is ERC1155 {
    uint256 public constant GOLD = 0;

    constructor(address addr) ERC1155('https://game.example/api/item/') {
        _mint(addr, GOLD, 5, '');
    }
}
