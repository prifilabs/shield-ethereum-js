// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TestERC20 is ERC20 {
    constructor(address addr, uint256 initialSupply) ERC20('Name', 'SYM') {
        _mint(addr, initialSupply);
    }
}
