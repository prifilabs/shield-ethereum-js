import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Shield, createShield, createShieldInstance, createCredentials, approveCredentials } from "../src/index";

describe("Shield", function () {
  
    async function deployFactoryFixture(){
        const [ owner, alice, bob ] = await ethers.getSigners();
        const FactoryContractFactory = await ethers.getContractFactory("ShieldFactory");
        const factory = await FactoryContractFactory.deploy();
        return { factory, alice, bob };
    }
  
    let context;
    
    describe("Deployment", function () {
      
      it("Should deploy", async function () {
        const { factory, alice, bob } = await loadFixture(deployFactoryFixture);
        const ShieldContractFactory = await ethers.getContractFactory("Shield");
        const shield = await createShield(alice, "MyShield", ["admin", "employee"], [{addr: alice.address, roles: ["admin", "employee"]}], [["admin"]], factory, ShieldContractFactory.interface);
        const badShield = await createShield(bob, "BadShield", ["admin"], [{addr: alice.address, roles: ["admin"]}], [["admin"]], factory, ShieldContractFactory.interface);
        context = { factory, shield, badShield, alice, bob };
      });
      
      it("Should get the roles", async function () {
          const { shield, alice } = context;
          expect(await shield.getRoles()).to.have.members(['admin', "employee"]);
      });
      
      it("Should get the users", async function () {
          const { shield, alice } = context;
          expect(await shield.getUser(alice.address)).to.have.members(['admin', "employee"]);
      });

      it("Should get the admin rule", async function () {
          const { shield, alice } = context;
          expect(await shield.getPolicy("admin-rule")).to.deep.equal([['admin']]);
      });

      it("Should get the admin assignments", async function () {
          const { shield, alice } = context;
          for (let f of ['addRoles', 'setUser', 'addPolicy', 'assignPolicy', 'pause', 'unpause', 'transfer']){
              // console.log(await shield.contract.interface.getSighash(f));
              expect(await shield.getAssignedPolicy(shield.contract, f)).to.deep.equal([['admin']]);
          }
      });
      
      it("Should be unpause", async function () {
          const { shield, alice } = context;
          expect(await shield.isPaused()).to.be.false;
      });
    });

    describe("Admin", function () {

      it("Should add a role", async function () {
          const { shield, alice } = context;
          const oldRoles = await shield.getRoles();
          const newRoles = ['engineer'];
          const credentials = await shield.createCredentialsForAddRoles(alice, newRoles);
          await shield.addRoles(alice, newRoles, credentials);
          expect(await shield.getRoles()).to.have.members([...oldRoles,...newRoles]);
      });

      it("Should set a user", async function () {
          const { shield, alice, bob } = context;
          const roles = ['employee', 'engineer'];
          const credentials = await shield.createCredentialsForSetUser(alice, bob.address, roles);
          await shield.setUser(alice, bob.address, roles, credentials);
          expect(await shield.getUser(bob.address)).to.have.members(roles);
      });

      it("Should add a rule", async function () {
          const { shield, alice } = context;
          const label = 'everybody';
          const policy = [['admin', 'employee', 'engineer']];
          const credentials = await shield.createCredentialsForAddPolicy(alice, label, policy);
          await shield.addPolicy(alice, label, policy, credentials);
          expect(await shield.getPolicy(label)).to.deep.equal(policy);
      });

      it("Should set an assignment", async function () {
          const { shield, alice } = context;
          const f = "pause";
          const label = 'everybody';
          const credentials = await shield.createCredentialsForAssignPolicy(alice, shield.contract, f, label);
          await shield.assignPolicy(alice, shield.contract, f, label, credentials);
          // const policy = await shield.getPolicy(label)
          // expect(await shield.getAssignedPolicy(shield.contract, f)).to.deep.equal(policy);
      });
      
      it("Should add a rule and set an assignment", async function () {
          const { shield, alice } = context;
          const label = 'two-step';
          const policy = [['employee'], ['admin']];
          const credentials1 = await shield.createCredentialsForAddPolicy(alice, label, policy);
          await shield.addPolicy(alice, label, policy, credentials1);
          expect(await shield.getPolicy(label)).to.deep.equal(policy);
          const f = "unpause";
          const credentials2 = await shield.createCredentialsForAssignPolicy(alice, shield.contract, f, label);
          await shield.assignPolicy(alice, shield.contract, f, label, credentials2);
          expect(await shield.getAssignedPolicy(shield.contract, f)).to.deep.equal(policy);
      });
      
      
      it("Should pause the shield", async function () {
          const { shield, bob } = context;
          const credentials = await shield.createCredentialsForPause(bob);
          await shield.pause(bob, credentials);
      });
      
      it("Should not be able to call anything but unpause", async function () {
          const { shield, bob } = context;
          const credentials = await shield.createCredentialsForPause(bob);
          await expect(shield.pause(bob, credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
      });

      it("Should unpause the shield", async function () {
          const { shield, alice, bob } = context;
          const credentials1 = await shield.createCredentialsForUnpause(bob);
          await expect(shield.unpause(bob, credentials1)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
          const credentials2 = await approveCredentials(alice, credentials1);
          await shield.unpause(bob, credentials2);
          expect(await shield.isPaused()).to.be.false;
      });
    });
    
    describe("Rejections", function () {
        
        it("Should reject if not allowed", async function () {
            const { shield, bob } = context;
            const credentials = await shield.createCredentialsForAssignPolicy(bob, shield.contract, "unpause", "everybody");
            await expect(shield.assignPolicy(bob, shield.contract, "unpause", "everybody", credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });

        it("Should reject if the contract address is different", async function () {
            const { shield, badShield, bob } = context;
            const roles = ["role"];
            const credentials = await badShield.createCredentialsForAddRoles(bob, roles);
            await expect(shield.addRoles(bob, roles, credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });
        
        it("Should reject if the sender is not the signer", async function () {
            const { shield, alice, bob } = context;
            const roles = ["maybe"];
            const credentials = await shield.createCredentialsForAddRoles(alice, roles);
            await expect(shield.addRoles(bob, roles, credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });

        it("Should reject if the function is different", async function () {
            const { shield, alice } = context;
            const credentials = await shield.createCredentialsForAddRoles(alice, ["another-role"]);
            await expect(shield.addPolicy(alice, "another-rule", [["admin"]], credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });
    
        it("Should reject if approvals is empty", async function () {
            const { shield, alice, bob } = context;
            const credentials = await shield.createCredentialsForSetUser(alice, bob.address, []);
            credentials.approvals = [];
            await expect(shield.setUser(alice, bob.address, [], credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });
        
        it("Should reject if the signed twice", async function () {
            const { shield, alice } = context;
            const credentials1 = await shield.createCredentialsForUnpause(alice);
            const credentials2 = await approveCredentials(alice, credentials1);
            await expect(shield.unpause(alice, credentials2)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });
        
        it("Should reject if credentials are used twice", async function () {
            const { shield, alice } = context;
            const roles = ["maybe"];
            const credentials = await shield.createCredentialsForAddRoles(alice, roles);
            await shield.addRoles(alice, roles, credentials);
            await expect(shield.addRoles(alice, roles, credentials)).to.be.revertedWithCustomError(shield.contract, "InvalidCredentials");
        });
        
        it("Should reject if add more than 64 roles to shield", async function () {
            const { shield, alice } = context;
            const roles = Array(65).fill("maybe");
            const credentials = await shield.createCredentialsForAddRoles(alice, roles);
            await expect(shield.addRoles(alice, roles, credentials)).to.be.reverted;
        });
        
        it("Should reject if create shield with more than 64 roles", async function () {
            const { factory, alice } = context;
            const ShieldContractFactory = await ethers.getContractFactory("Shield");
            const roles = Array(65).fill("admin");
            await expect(createShield(alice, "MyShield", roles, [{addr: alice.address, roles: ["admin"]}], [["admin"]], factory, ShieldContractFactory.interface)).to.be.reverted;
        });  
        
        it("Should reject if bad rule", async function () {
            const { shield, alice } = context;
            let label = '';
            const policy = [];
            let credentials = await shield.createCredentialsForAddPolicy(alice, label, policy);
            await expect(shield.addPolicy(alice, label, policy, credentials)).to.be.revertedWithCustomError(shield.contract, "ShieldError");
            label = 'admin-rule';
            credentials = await shield.createCredentialsForAddPolicy(alice, label, policy);
            await expect(shield.addPolicy(alice, label, policy, credentials)).to.be.revertedWithCustomError(shield.contract, "ShieldError");
            label = 'good-label';
            credentials = await shield.createCredentialsForAddPolicy(alice, label, policy);
            await expect(shield.addPolicy(alice, label, policy, credentials)).to.be.revertedWithCustomError(shield.contract, "ShieldError");
        });  
    
  });
  
});
