// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

struct Credentials {
    uint timestamp;
    uint chainid;
    address to;
    bytes call;
    bytes[] approvals;
}

struct User {
    address addr;
    bytes8 roles;
}

error InvalidCredentials(string reason);

abstract contract Shieldable {
    Shield internal shield;

    constructor(Shield _shield) {
        shield = _shield;
    }

    modifier shielded() {
        require(msg.sender == address(shield));
        _;
    }
}

contract Shield is Shieldable, Initializable, ReentrancyGuard {
    bool public paused;
    bytes32[] internal roles;
    mapping(address => bytes8) internal users;
    mapping(bytes32 => bytes8[]) internal policies;
    mapping(address => mapping(bytes4 => bytes32)) internal assignments;

    mapping(bytes32 => bool) public executed;
    mapping(bytes32 => bool) public canceled;

    event RolesAdded(bytes32[] roles);
    event UsersSet(User[] users);
    event PolicyAdded(bytes32 indexed label, bytes8[] policy);
    event PolicyAssigned(address indexed to, bytes4 sig, bytes32 indexed label);
    event Paused();
    event Unpaused();

    error ShieldError(string reason);

    constructor() Shieldable(this) {
        _disableInitializers();
    }

    function initialize(
        bytes32[] calldata _roles,
        User[] calldata _users,
        bytes8[] calldata policy
    ) public initializer {
        shield = this;
        if (_roles.length > 64)
            revert ShieldError('The Shield cannot have more than 64 roles');
        roles = _roles;
        emit RolesAdded(_roles);

        _setUsers(_users);

        // auto-administration
        _addPolicy('admin-policy', policy);
        _assignPolicy(address(this), 0x5e7c67db, 'admin-policy');
        _assignPolicy(address(this), 0x67eae18b, 'admin-policy');
        _assignPolicy(address(this), 0x101970f7, 'admin-policy');
        _assignPolicy(address(this), 0x2cfcf272, 'admin-policy');
        _assignPolicy(address(this), 0x8456cb59, 'admin-policy');
        _assignPolicy(address(this), 0x3f4ba83a, 'admin-policy');
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addRoles(bytes32[] calldata _roles) public shielded {
        if (roles.length + _roles.length > 64)
            revert ShieldError('The Shield cannot have more than 64 roles');
        for (uint i = 0; i < _roles.length; i++) roles.push(_roles[i]);
        emit RolesAdded(_roles);
    }

    function getRoles() public view returns (bytes32[] memory) {
        return roles;
    }

    function _getMask() private view returns (bytes8) {
        return bytes8(0xffffffffffffffff) >> (64 - roles.length);
    }

    function _setUsers(User[] memory _users) private {
        bytes8 mask = _getMask();
        for (uint i = 0; i < _users.length; i++) {
            User memory user = _users[i];
            user.roles = user.roles & mask;
            users[user.addr] = user.roles;
        }
        emit UsersSet(_users);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function setUsers(User[] memory _users) public shielded {
        _setUsers(_users);
    }

    function getUser(address user) public view returns (bytes8) {
        return users[user];
    }

    function hasAnyRoles(
        address user,
        bytes8 _roles
    ) public view returns (bool) {
        bytes8 result = getUser(user) & _roles;
        return (result != bytes8(0));
    }

    function _addPolicy(bytes32 label, bytes8[] memory policy) private {
        if (label == bytes32(0)) revert ShieldError('Undefined label');
        if (policies[label].length > 0)
            revert ShieldError('Label already exists');
        if (policy.length == 0) revert ShieldError('Policy cannot be empty');
        bytes8 mask = _getMask();

        for (uint i = 0; i < policy.length; i++) policy[i] = policy[i] & mask;
        policies[label] = policy;
        emit PolicyAdded(label, policy);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addPolicy(
        bytes32 label,
        bytes8[] calldata policy
    ) public shielded {
        _addPolicy(label, policy);
    }

    function getPolicy(bytes32 label) public view returns (bytes8[] memory) {
        return policies[label];
    }

    function _assignPolicy(address to, bytes4 sig, bytes32 label) private {
        assignments[to][sig] = label;
        emit PolicyAssigned(to, sig, label);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function assignPolicy(
        address to,
        bytes4 sig,
        bytes32 label
    ) public shielded {
        _assignPolicy(to, sig, label);
    }

    function getAssignedPolicy(
        address to,
        bytes4 sig
    ) public view returns (bytes8[] memory) {
        bytes32 label = assignments[to][sig];
        return policies[label];
    }

    function pause() public shielded {
        paused = true;
        emit Paused();
    }

    function unpause() public shielded {
        paused = false;
        emit Unpaused();
    }

    using ECDSA for bytes32;

    function validateCredentials(
        Credentials calldata credentials,
        bool full
    ) public view returns (address[] memory) {
        if (credentials.chainid != block.chainid) {
            revert InvalidCredentials('Chain ID mismatch');
        }
        if (credentials.approvals.length == 0) {
            revert InvalidCredentials('Approvals cannot be empty');
        }
        bytes8[] memory policy = getAssignedPolicy(
            credentials.to,
            bytes4(credentials.call[:4])
        );
        if (full) {
            if (canceled[keccak256(credentials.approvals[0])]) {
                revert InvalidCredentials('Credentials have been canceled');
            }
            if (executed[keccak256(credentials.approvals[0])]) {
                revert InvalidCredentials(
                    'Credentials have been executed already'
                );
            }
            if (credentials.approvals.length != policy.length) {
                revert InvalidCredentials('Incorrect number of approvals');
            }
        } else {
            if (credentials.approvals.length > policy.length) {
                revert InvalidCredentials('Incorrect number of approvals');
            }
        }
        address[] memory signers = new address[](credentials.approvals.length);
        for (uint i = 0; i < credentials.approvals.length; i++) {
            bytes memory approval = credentials.approvals[i];
            bytes32 signerHash;
            if (i == 0) {
                signerHash = keccak256(
                    abi.encode(
                        credentials.timestamp,
                        credentials.chainid,
                        credentials.to,
                        credentials.call
                    )
                );
            } else {
                signerHash = keccak256(
                    abi.encode(credentials.approvals[i - 1])
                );
            }
            address signer = signerHash.toEthSignedMessageHash().recover(
                approval
            );
            if (!hasAnyRoles(signer, policy[i])) {
                revert InvalidCredentials('Policy violation');
            }
            if (i == 0) {
                if (signer != msg.sender) {
                    revert InvalidCredentials(
                        'The owner must be the first approver'
                    );
                }
            } else {
                for (uint j = 0; j < i; j++) {
                    if (signers[j] == signer) {
                        revert InvalidCredentials(
                            'Same address cannot sign twice'
                        );
                    }
                }
            }
            signers[i] = signer;
        }
        return signers;
    }

    function cancelCredentials(Credentials calldata credentials) public {
        address[] memory signers = validateCredentials(credentials, false);
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == msg.sender) {
                canceled[keccak256(credentials.approvals[0])] = true;
                break;
            }
        }
    }

    function executeCredentials(
        Credentials calldata credentials
    ) public payable nonReentrant returns (bytes memory) {
        if (paused) {
            if (bytes4(credentials.call[:4]) == 0x8456cb59) {
                revert InvalidCredentials('The Shield is paused');
            }
        }
        validateCredentials(credentials, true);
        (bool success, bytes memory returndata) = address(credentials.to).call{
            value: msg.value
        }(credentials.call);
        if (!success) {
            if (returndata.length == 0)
                revert ShieldError('credentials execution error');
            assembly {
                revert(add(32, returndata), mload(returndata))
            }
        }
        executed[keccak256(credentials.approvals[0])] = true;
        return returndata;
    }
}
