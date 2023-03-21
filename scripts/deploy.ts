import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ShieldFactory = await ethers.getContractFactory("ShieldFactory");
  const factory = await ShieldFactory.deploy();
  console.log("Shield Factory address:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
