import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Shield, createShield, createCredentials, approveCredentials } from "../src/index";

describe("Shield", function () {
  
    async function deployFactoryFixture(){
        const [ owner, alice, bob, mallory ] = await ethers.getSigners();
        const FactoryContractFactory = await ethers.getContractFactory("ShieldFactory");
        const factory = await FactoryContractFactory.deploy();
        return { factory, alice, bob, mallory };
    }
  
    let context;
    
    describe("Deployment", function () {
      
      it("Should deploy", async function () {
        const { factory, alice, bob, mallory } = await loadFixture(deployFactoryFixture);
        const ShieldContractFactory = await ethers.getContractFactory("Shield");
        const shield = await createShield(alice, "MyShield", ["admin"], [{addr: alice.address, roles: ["admin"]}], [["admin"]], factory, ShieldContractFactory);
        context = {factory, shield, alice, bob, mallory};
      });
      
      it("Should set the roles", async function () {
          const { shield, alice } = context;
          expect(await shield.getRoles()).to.have.members(['admin']);
      });
      
      it("Should set the users", async function () {
          const { shield, alice } = context;
          expect(await shield.getUser(alice.address)).to.have.members(['admin']);
      });

      it("Should set the admin rule", async function () {
          const { shield, alice } = context;
          expect(await shield.getRule("admin-rule")).to.deep.equal([['admin']]);
      });

      it("Should set the admin assignments", async function () {
          const { shield, alice } = context;
          for (let f of ['addRoles', 'setUser', 'addRule', 'assignRule']){
              expect(await shield.getAssignment(shield.contract, f)).to.deep.equal([['admin']]);
          }
      });
    });

    describe("Admin", function () {

      it("Should add a role", async function () {
          const { shield, alice } = context;
          const oldRoles = await shield.getRoles();
          const newRoles = ['employee', 'engineer'];
          const credentials = await shield.createCredentialsForAddRoles(newRoles);
          await shield.addRoles(newRoles, credentials);
          expect(await shield.getRoles()).to.have.members([...oldRoles,...newRoles]);
      });

      it("Should set a user", async function () {
          const { shield, alice, bob } = context;
          const roles = ['engineer'];
          const credentials = await shield.createCredentialsForSetUser(bob.address, roles);
          await shield.setUser(bob.address, roles, credentials);
          expect(await shield.getUser(bob.address)).to.have.members(roles);
      });

      it("Should add a rule", async function () {
          const { shield, alice } = context;
          const label = 'new-rule';
          const policy = [['engineer'],['admin']]
          const credentials = await shield.createCredentialsForAddRule(label, policy);
          await shield.addRule(label, policy, credentials);
          expect(await shield.getRule(label)).to.deep.equal(policy);
      });

      it("Should set an assignment", async function () {
          const { shield, alice } = context;
          const f = "addRoles";
          const label = 'new-rule';
          const credentials = await shield.createCredentialsForAssignRule(shield.contract, f, label);
          await shield.assignRule(shield.contract, f, label, credentials);
          const policy = await shield.getRule(label)
          expect(await shield.getAssignment(shield.contract, f)).to.deep.equal(policy);
      });

      it("Should validate multiple approvals", async function () {
          const { shield, alice, bob } = context;
          const oldRoles = await shield.getRoles();
          const newRoles = ['accountant', 'hr'];
          const bobShield = new Shield(shield.contract, bob);
          const credentials = await bobShield.createCredentialsForAddRoles(newRoles);
          const approvedCredentials = await approveCredentials(alice, credentials);
          await bobShield.addRoles(newRoles, approvedCredentials);
          expect(await shield.getRoles()).to.have.members([...oldRoles,...newRoles]);
      });

    });
});