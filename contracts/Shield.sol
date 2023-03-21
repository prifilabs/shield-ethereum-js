// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

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
    mapping(uint => bool) internal timestamps;
     
    event IsShieldable(address c);
 
    error InvalidCredentials(string reason);
    
    constructor(Shield _shield){
        shield = _shield;
        emit IsShieldable(address(this));
    }

    modifier checkCredentials(Credentials memory credentials){ 
        if (timestamps[credentials.timestamp]){
            revert InvalidCredentials("Credentials has been used already");
        }
        uint l = msg.data.length - abi.encode(credentials).length;
        shield.validateCredentials(credentials, msg.sender, address(this), msg.sig, msg.data[:l]);
        _;
        timestamps[credentials.timestamp] = true;
    }
}

contract Shield is Shieldable, Initializable{
    
    bool public paused;
    bytes32[] internal roles;    
    mapping(address => bytes8) internal users;
    mapping(bytes32 => bytes8[]) internal rules;
    mapping (address => mapping (bytes4 => bytes32)) internal assignments;
    
    event AddRoles(bytes32[] roles);
    event SetUser(address indexed addr, bytes8 roles);
    event AddRule(bytes32 indexed label, bytes8[] policy);
    event AssignRule(address indexed to, bytes4 sig, bytes32 indexed label);
    event Paused();
    event Unpaused();
    
    error ShieldError(string reason);
    
    constructor() Shieldable(this) {
        _disableInitializers();
    }
    
    function initialize(
        bytes32[] memory _roles,
        User[] memory _users,
        bytes8[] memory policy
    ) public initializer {
        shield = this;
        paused = false;
        if (_roles.length > 64) revert ShieldError('The Shield cannot have more than 64 roles');
        roles = _roles;
        emit AddRoles(_roles);

        for (uint i = 0; i < _users.length; i++) {
            User memory user = _users[i];
            _setUser(user.addr, user.roles);
        }
        
        // auto-administration
        _addRule("admin-rule", policy);
        _assignRule(address(this), 0x4aece76e, "admin-rule");
        _assignRule(address(this), 0x5ebbc32a, "admin-rule");
        _assignRule(address(this), 0x87a02a13, "admin-rule");
        _assignRule(address(this), 0x48ec6cdf, "admin-rule");
        _assignRule(address(this), 0xe1b7351f, "admin-rule");
        _assignRule(address(this), 0xda1f874d, "admin-rule");
    }
    
    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addRoles(bytes32[] memory _roles, Credentials memory credentials) public checkCredentials(credentials){
        if (roles.length + _roles.length > 64) revert ShieldError('The Shield cannot have more than 64 roles');
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
    function setUser(address addr, bytes8 _roles, Credentials memory credentials) public checkCredentials(credentials){
        _setUser(addr, _roles);
    }
    
    function getUser(address user) public view returns(bytes8){
        return users[user];
    }
    
    function _addRule(bytes32 label, bytes8[] memory policy) private {
        if (label == bytes32(0)) revert ShieldError('Undefined label');
        if (rules[label].length > 0) revert ShieldError('Label already exists');
        if (policy.length == 0) revert ShieldError('Policy cannot be empty');
        bytes8 mask = _getMask();
        for (uint i = 0; i < policy.length; i++) policy[i] = policy[i] & mask;
        rules[label] = policy;        
        emit AddRule(label, policy);
    }
    
    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function addRule(bytes32 label, bytes8[] memory policy, Credentials memory credentials) public checkCredentials(credentials){
        _addRule(label, policy);
    }
    
    function getRule(bytes32 label) public view returns (bytes8[] memory) {
        return rules[label];
    }
    
    function _assignRule(address to, bytes4 sig, bytes32 label) private {
        assignments[to][sig] = label;
        emit AssignRule(to, sig, label);
    }
    
    // If you change the signature of this function, do not forget to update the function signature in the function 'initialize'
    function assignRule(address to, bytes4 sig, bytes32 label, Credentials memory credentials) public checkCredentials(credentials){
        _assignRule(to, sig, label);
    }
    
    function getAssignment(address to, bytes4 sig) public view returns(bytes8[] memory) {
        bytes32 label = assignments[to][sig];
        return rules[label];
    }
    
    function pause(Credentials memory credentials) public checkCredentials(credentials){
        paused = true;
        emit Paused();
    }
    
    function unpause(Credentials memory credentials) public checkCredentials(credentials){
        paused = false;
        emit Unpaused();
    }
    
    using ECDSA for bytes32;
    
    function validateCredentials(Credentials calldata credentials) public view {
        bytes32 signerHash = keccak256(abi.encode(credentials.to, credentials.call, credentials.timestamp));
        address signer = signerHash.toEthSignedMessageHash().recover(credentials.approvals[0]);
        validateCredentials(credentials, signer, credentials.to, bytes4(credentials.call[:6]), credentials.call);
    }
    
    function validateCredentials(Credentials memory credentials, address sender, address to, bytes4 f, bytes memory call) public view {
        require(!paused, "The Shield is paused");
        if (credentials.to != to){
            revert InvalidCredentials("Contract mismatch");
        }
        if (keccak256(call) != keccak256(credentials.call)){
            revert InvalidCredentials("Function mismatch");
        }
        if (credentials.approvals.length == 0){
            revert InvalidCredentials("Approvals cannot be empty");
        }
        bytes8[] memory policy = getAssignment(to, f);
        if (credentials.approvals.length != policy.length){
            revert InvalidCredentials("Incorrect number of approvals");
        }
        address[] memory signers = new address[](credentials.approvals.length) ;
        for (uint i=0; i<credentials.approvals.length; i++) {
            bytes memory approval = credentials.approvals[i];
            bytes32 signerHash;
            if (i == 0){
                signerHash = keccak256(abi.encode(credentials.to, credentials.call, credentials.timestamp));
            } else {
                signerHash = keccak256(abi.encode(credentials.approvals[i-1]));
            }
            address signer = signerHash.toEthSignedMessageHash().recover(approval);
            bytes32 isValid =  getUser(signer) & policy[i];
            if (isValid == bytes32(0)){
                revert InvalidCredentials("Policy violation");
            }
            if (i == 0){
                if (signer != sender){
                    revert InvalidCredentials("The owner must be the first approver");
                }
            } else {
                for(uint j=0; j<i; j++){
                    if (signers[j] == signer){
                        revert InvalidCredentials("Same address cannot sign twice");
                    }
                }
            }
            signers[i] = signer;
        }
    }
}
