// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract TestERC721 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(address addr) ERC721('name', 'SYM') {
        uint256 newItemId = _tokenIds.current();
        _mint(addr, newItemId);
        _tokenIds.increment();
    }
}
