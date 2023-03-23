// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/proxy/Clones.sol';
import './Shield.sol';

contract ShieldFactory {
    address immutable shieldImpl;

    event ShieldCreated(
        address creator,
        address indexed shield,
        bytes32 name
    );
    
    event UserAdded(address shield, address user);

    constructor() {
        shieldImpl = address(new Shield());
    }

    function createShield(
        bytes32 name,
        bytes32[] memory roles,
        User[] memory users,
        bytes8[] memory policy
    ) public {
        // https://github.com/OpenZeppelin/workshops/blob/master/02-contracts-clone/contracts/1-ERC20/FactoryClone.sol
        // https://ethereum.stackexchange.com/a/97123/115147
        address payable clone = payable(Clones.clone(shieldImpl));
        Shield(clone).initialize(this, roles, users, policy);
        emit ShieldCreated(msg.sender, clone, name);
    }
    
    function addUser(address shield, address user) public {
        emit UserAdded(shield, user);
    }
}
