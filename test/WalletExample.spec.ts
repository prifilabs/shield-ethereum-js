import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import {
    Shield,
    createShield,
    createCredentials,
    approveCredentials,
} from '../src/index'

describe("Wallet Example", function () {
  
    async function deployFactoryFixture(){
        const [ alice, bob] = await ethers.getSigners();
        const FactoryContractFactory = await ethers.getContractFactory("ShieldFactory");
        const factory = await FactoryContractFactory.deploy();
        return { factory, alice, bob };
    }
    
    describe("With Shield", function () {
        
      let context;
      
      it("Should deploy a shield", async function () {
            const { factory, alice, bob } = await loadFixture(deployFactoryFixture);
            const ShieldContractFactory = await ethers.getContractFactory("Shield");
            const name = "MyShield";
            const roles = ["employee", "admin"];
            const users = [
                {addr: alice.address, roles: ["admin"]},
                {addr: bob.address, roles: ["employee"]},
            ];
            const policy = [["admin"]];
            const shield = await createShield(alice, name, roles, users, policy, factory, ShieldContractFactory.interface);
            context = { shield, alice, bob };
      });
      
      it("Should deploy a shieldable wallet", async function () {
          const { shield, alice } = context;
          const Wallet = await ethers.getContractFactory("WalletExampleWithShield");
          const balance = ethers.utils.parseEther("100");
          const wallet = await Wallet.connect(alice).deploy(shield.contract.address, {value: balance});
          context = {...context, wallet};
      });
      
      it("Should not allow Alice to withdraw ", async function () {
          const { shield, wallet, alice } = context;
          const credentials = await createCredentials(alice, wallet, "withdraw", [1000]);
          await expect(wallet.connect(alice).withdraw(1000, credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
      });
      
      it("Should configure the shield to protect the wallet", async function () {
          const { shield, wallet, alice } = context;
          const label = "1-step-rule";
          const policy = [["admin"]];
          const credentials1 = await shield.createCredentialsForAddPolicy(alice, label, policy);
          await shield.addPolicy(alice, label, policy, credentials1);
          const f = "withdraw";
          const credentials2 = await shield.createCredentialsForAssignPolicy(alice, wallet, f, label);
          await shield.assignPolicy(alice, wallet, f, label, credentials2);
          context = {...context, wallet};
      });
      
      it("Should allow Alice to withdraw (1 step)", async function () {
          const { shield, wallet, alice } = context;
          const credentials = await createCredentials(alice, wallet, "withdraw", [1000]);
          await wallet.connect(alice).withdraw(1000, credentials);
      });
      
      it("Should allow Alice to withdraw (2 steps)", async function () {
          const { shield, wallet, alice, bob } = context;
          const label = "2-steps-rule";
          const policy = [["employee"], ["admin"]];
          const credentials1 = await shield.createCredentialsForAddPolicy(alice, label, policy);
          await shield.addPolicy(alice, label, policy, credentials1);
          const f = "withdraw";
          const credentials2 = await shield.createCredentialsForAssignPolicy(alice, wallet, f, label);
          await shield.assignPolicy(alice, wallet, f, label, credentials2);
          const credentials3 = await createCredentials(bob, wallet, "withdraw", [1000]);
          const credentials4 = await approveCredentials(alice, credentials3);
          await wallet.connect(bob).withdraw(1000, credentials4);
      });
      
    });
    
    describe("Withdraw without Shield", function () {

        it("Should allow to withdraw", async function () {
            const [ alice ] = await ethers.getSigners();
            const Wallet = await ethers.getContractFactory("WalletExampleWithoutShield");
            const balance = ethers.utils.parseEther("100");
            const wallet = await Wallet.connect(alice).deploy({value: balance});
            await wallet.connect(alice).withdraw(1000);
        });
    });
    
});
