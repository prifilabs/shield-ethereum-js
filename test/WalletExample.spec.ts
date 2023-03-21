import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Shield, createShield, createCredentials, approveCredentials } from "../src/index";

describe("Wallet Example", function () {
  
    async function deployFactoryFixture(){
        const [ owner, alice, bob] = await ethers.getSigners();
        const FactoryContractFactory = await ethers.getContractFactory("ShieldFactory");
        const factory = await FactoryContractFactory.deploy();
        return { factory, alice, bob };
    }
  
    let context;
    
    describe("Deployment", function () {
      
      it("Should deploy a shield", async function () {
            const { factory, alice, bob, mallory } = await loadFixture(deployFactoryFixture);
            const ShieldContractFactory = await ethers.getContractFactory("Shield");
            const name = "MyShield";
            const roles = ["employee", "admin"];
            const users = [
                {addr: alice.address, roles: ["admin"]},
                {addr: bob.address, roles: ["employee"]},
            ];
            const policy = [["admin"]];
            const shield = await createShield(alice, name, roles, users, policy, factory, ShieldContractFactory);
            context = { shield, alice, bob };
      });
      
      it("Should deploy a shieldable wallet", async function () {
          const { shield, alice } = context;
          const Wallet = await ethers.getContractFactory("WalletExample");
          const balance = ethers.utils.parseEther("100");
          const wallet = await Wallet.connect(alice).deploy(shield.contract.address, {value: balance});
          context = {...context, wallet};
      });
      
      it("Should configure the shield to protect the wallet", async function () {
          const { shield, wallet, alice } = context;
          const label = "1-step-rule";
          const policy = [["admin"]];
          const credentials1 = await shield.createCredentialsForAddRule(label, policy);
          await shield.addRule(label, policy, credentials1);
          const f = "protectedWithdraw";
          const credentials2 = await shield.createCredentialsForAssignRule(wallet, f, label);
          await shield.assignRule(wallet, f, label, credentials2);
          context = {...context, wallet};
      });
      
    });
    
    describe("One Approval Withdraw", function () {

        it("Should allow Alice to withdraw (unprotected)", async function () {
            const { shield, wallet, alice } = context;
            await wallet.connect(alice).unprotectedWithdraw(1000);
        });

        it("Should allow Alice to withdraw ", async function () {
            const { shield, wallet, alice } = context;
            const credentials = await createCredentials(alice, wallet, "protectedWithdraw", [1000]);
            await wallet.connect(alice).protectedWithdraw(1000, credentials);
        });

    });
    
    describe("Two Approvals Withdraw", function () {

        it("Should allow Alice to withdraw ", async function () {
            const { shield, wallet, alice, bob } = context;
            const label = "2-steps-rule";
            const policy = [["employee"], ["admin"]];
            const credentials1 = await shield.createCredentialsForAddRule(label, policy);
            await shield.addRule(label, policy, credentials1);
            const f = "protectedWithdraw";
            const credentials2 = await shield.createCredentialsForAssignRule(wallet, f, label);
            await shield.assignRule(wallet, f, label, credentials2);
            const credentials3 = await createCredentials(bob, wallet, "protectedWithdraw", [1000]);
            const credentials4 = await approveCredentials(alice, credentials3);
            await wallet.connect(bob).protectedWithdraw(1000, credentials4);
        });

    });
});