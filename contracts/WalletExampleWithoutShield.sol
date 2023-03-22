// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract WalletExampleWithoutShield {
    
    address private owner;

    constructor() payable {
        owner = msg.sender;
    }

    function withdraw(uint256 amount) public {
        require(owner == msg.sender);
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent);
    }
}
