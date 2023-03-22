// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

struct Credentials {
    address to;
    bytes call;
    uint timestamp;
    bytes[] approvals;
}

struct User {
    address addr;
    bytes8 roles;
}

abstract contract Shieldable {
    Shield internal shield;
    mapping(bytes32 => bool) internal burns;

    event IsShieldable(address c);

    error InvalidCredentials(string reason);

    constructor(Shield _shield) {
        shield = _shield;
        emit IsShieldable(address(this));
    }

    modifier checkCredentials(Credentials calldata credentials) {
        if (shield.paused()) {
            if (!(address(this) == address(shield) && msg.sig == 0xda1f874d)) {
                revert InvalidCredentials('The Shield is paused');
            }
        }
        uint l = msg.data.length - abi.encode(credentials).length;
        shield.validateCredentials(
            credentials,
            msg.sender,
            address(this),
            msg.sig,
            msg.data[:l],
            true
        );
        _;
        burns[keccak256(credentials.approvals[0])] = true;
    }
}

contract Shield is Shieldable, Initializable, ReentrancyGuard {
    bool public paused;
    bytes32[] internal roles;
    mapping(address => bytes8) internal users;
    mapping(bytes32 => bytes8[]) internal policies;
    mapping(address => mapping(bytes4 => bytes32)) internal assignments;

    event AddRoles(bytes32[] roles);
    event SetUser(address indexed addr, bytes8 roles);
    event AddPolicy(bytes32 indexed label, bytes8[] policy);
    event AssignPolicy(address indexed to, bytes4 sig, bytes32 indexed label);
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
        paused = false;
        if (_roles.length > 64)
            revert ShieldError('The Shield cannot have more than 64 roles');
        roles = _roles;
        emit AddRoles(_roles);

        for (uint i = 0; i < _users.length; i++) {
            User memory user = _users[i];
            _setUser(user.addr, user.roles);
        }

        // auto-administration
        _addPolicy('admin-rule', policy);
        _assignPolicy(address(this), 0x4aece76e, 'admin-rule');
        _assignPolicy(address(this), 0x5ebbc32a, 'admin-rule');
        _assignPolicy(address(this), 0x1df0be84, 'admin-rule');
        _assignPolicy(address(this), 0x02eba6ce, 'admin-rule');
        _assignPolicy(address(this), 0xe1b7351f, 'admin-rule');
        _assignPolicy(address(this), 0xda1f874d, 'admin-rule');
        _assignPolicy(address(this), 0x50542f2a, 'admin-rule');
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addRoles(
        bytes32[] calldata _roles,
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        if (roles.length + _roles.length > 64)
            revert ShieldError('The Shield cannot have more than 64 roles');
        for (uint i = 0; i < _roles.length; i++) roles.push(_roles[i]);
        emit AddRoles(_roles);
    }

    function getRoles() public view returns (bytes32[] memory) {
        return roles;
    }

    function _getMask() private view returns (bytes8) {
        return bytes8(0xffffffffffffffff) >> (64 - roles.length);
    }

    function _setUser(address addr, bytes8 _roles) private {
        bytes8 mask = _getMask();
        _roles = _roles & mask;
        users[addr] = _roles;
        emit SetUser(addr, _roles);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function setUser(
        address addr,
        bytes8 _roles,
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        _setUser(addr, _roles);
    }

    function getUser(address user) public view returns (bytes8) {
        return users[user];
    }

    function _addPolicy(bytes32 label, bytes8[] memory policy) private {
        if (label == bytes32(0)) revert ShieldError('Undefined label');
        if (policies[label].length > 0)
            revert ShieldError('Label already exists');
        if (policy.length == 0) revert ShieldError('Policy cannot be empty');
        bytes8 mask = _getMask();

        for (uint i = 0; i < policy.length; i++) policy[i] = policy[i] & mask;
        policies[label] = policy;
        emit AddPolicy(label, policy);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addPolicy(
        bytes32 label,
        bytes8[] calldata policy,
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        _addPolicy(label, policy);
    }

    function getPolicy(bytes32 label) public view returns (bytes8[] memory) {
        return policies[label];
    }

    function _assignPolicy(address to, bytes4 sig, bytes32 label) private {
        assignments[to][sig] = label;
        emit AssignPolicy(to, sig, label);
    }

    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function assignPolicy(
        address to,
        bytes4 sig,
        bytes32 label,
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        _assignPolicy(to, sig, label);
    }

    function getAssignedPolicy(
        address to,
        bytes4 sig
    ) public view returns (bytes8[] memory) {
        bytes32 label = assignments[to][sig];
        return policies[label];
    }

    function pause(
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        paused = true;
        emit Paused();
    }

    function unpause(
        Credentials calldata credentials
    ) public checkCredentials(credentials) {
        paused = false;
        emit Unpaused();
    }

    receive() external payable {}
    fallback() external payable {}

    function transfer(
        address payable _to,
        uint256 amount,
        Credentials calldata credentials
    ) public payable nonReentrant checkCredentials(credentials) {
        (bool sent, ) = _to.call{value: amount}('');
        require(sent);
    }

    using ECDSA for bytes32;

    function validateCredentials(
        Credentials calldata credentials,
        address sender,
        address to,
        bytes4 f,
        bytes calldata call,
        bool full
    ) public view returns (address[] memory) {
        if (credentials.to != to) {
            revert InvalidCredentials('Contract mismatch');
        }
        if (keccak256(call) != keccak256(credentials.call)) {
            revert InvalidCredentials('Function mismatch');
        }
        if (credentials.approvals.length == 0) {
            revert InvalidCredentials('Approvals cannot be empty');
        }
        bytes8[] memory policy = getAssignedPolicy(to, f);
        if (full){
            if (credentials.approvals.length != policy.length) {
                revert InvalidCredentials('Incorrect number of approvals');
            }
        }else{
            if (credentials.approvals.length > policy.length){
                revert InvalidCredentials('Incorrect number of approvals');
            }
        }
        if (burns[keccak256(credentials.approvals[0])]) {
            revert InvalidCredentials('Credentials have been used already');
        }
        address[] memory signers = new address[](credentials.approvals.length);
        for (uint i = 0; i < credentials.approvals.length; i++) {
            bytes memory approval = credentials.approvals[i];
            bytes32 signerHash;
            if (i == 0) {
                signerHash = keccak256(
                    abi.encode(
                        credentials.to,
                        credentials.call,
                        credentials.timestamp
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
            bytes32 isValid = getUser(signer) & policy[i];
            if (isValid == bytes32(0)) {
                revert InvalidCredentials('Policy violation');
            }
            if (i == 0) {
                if (signer != sender) {
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

    function burnCredentials(Credentials calldata credentials) public {
        bytes32 signerHash = keccak256(
            abi.encode(credentials.to, credentials.call, credentials.timestamp)
        );
        address signer = signerHash.toEthSignedMessageHash().recover(
            credentials.approvals[0]
        );
        address[] memory signers = validateCredentials(
            credentials,
            signer,
            credentials.to,
            bytes4(credentials.call[:4]),
            credentials.call,
            false
        );
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == msg.sender) {
                burns[keccak256(credentials.approvals[0])] = true;
                break;
            }
        }
    }
}
