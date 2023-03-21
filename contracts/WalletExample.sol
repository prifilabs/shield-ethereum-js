pragma solidity ^0.8.9;

import "./Shield.sol";

contract WalletExample is Shieldable{
   
   address private owner;
   
   constructor(Shield shield) payable Shieldable(shield){
       owner = msg.sender;
   }

   function unprotectedWithdraw(uint256 amount) public {
       require(owner == msg.sender);
       payable(msg.sender).transfer(amount);
   }
   
   function protectedWithdraw(uint256 amount, Credentials memory credentials) public checkCredentials(credentials) {
       payable(msg.sender).transfer(amount);
   }
}