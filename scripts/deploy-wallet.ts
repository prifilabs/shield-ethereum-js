import { ethers } from 'hardhat'

import { instantiateShield } from '../src/index'

const SHIELD_ADDRESS = '0x852025eDB1075Ec1181b01e08d163dBbB60a38d6'

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const shield = await instantiateShield(deployer, SHIELD_ADDRESS)

    const Wallet = await ethers.getContractFactory('WalletExampleWithShield')
    const wallet = await Wallet.deploy(SHIELD_ADDRESS)
    console.log('Wallet address:', wallet.address)

    shield.addInterface(wallet.address, wallet.interface)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
