// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Shield.sol";

contract WalletExampleWithShield is Shieldable {

    constructor(Shield shield) payable Shieldable(shield) {
        
    }

    function withdraw(
        uint256 amount,
        Credentials memory credentials
    ) public checkCredentials(credentials) {
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent);
    }
}
