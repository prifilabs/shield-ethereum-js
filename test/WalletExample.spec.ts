import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import {
    Shield,
    Store,
    createShield,
    instantiateShield,
    createCredentials,
    approveCredentials,
    executeCredentials,
} from '../src/index'

describe('Wallet Example', function () {
    async function deployFactoryFixture() {
        const [alice, bob] = await ethers.getSigners()
        const FactoryContractFactory = await ethers.getContractFactory(
            'ShieldFactory'
        )
        const factory = await FactoryContractFactory.deploy()
        return { factory, alice, bob }
    }

    describe('With Shield', function () {
        let context

        it('Should deploy a shield', async function () {
            const { factory, alice, bob } = await loadFixture(
                deployFactoryFixture
            )
            // Store.ServerStore.setServer("http://localhost:4000");
            // const store = Store.getServerStore;
            const store = undefined
            const name = 'MyShield'
            const roles = ['employee', 'admin']
            const users = [
                { addr: alice.address, roles: ['admin'] },
                { addr: bob.address, roles: ['employee'] },
            ]
            const policy = [['admin']]
            const { shield } = await createShield(
                alice,
                name,
                roles,
                users,
                policy,
                factory,
                store
            )
            const bobShield = await instantiateShield(
                bob,
                shield.contract.address,
                store
            )
            context = { shield, alice, bob, bobShield }
        })

        it('Should deploy a shieldable wallet', async function () {
            const { shield, alice } = context
            const Wallet = await ethers.getContractFactory(
                'WalletExampleWithShield'
            )
            const balance = ethers.utils.parseEther('100')
            const wallet = await Wallet.connect(alice).deploy(
                shield.contract.address,
                { value: balance }
            )
            shield.addInterface(wallet.address, wallet.interface)
            context = { ...context, wallet }
        })

        it('Should get wallet as one of the shieldables', async function () {
            const { shield, wallet } = context
            expect(await shield.getShieldables()).to.have.members([
                wallet.address,
            ])
        })

        it.skip('Should not allow Alice to withdraw', async function () {
            const { shield, wallet, alice } = context
            const credentials = await shield.createCredentials(
                alice,
                wallet.address,
                'withdraw',
                [1000]
            )
            await expect(
                shield.executeCredentials(alice, credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it('Should configure the shield to protect the wallet', async function () {
            const { shield, wallet, alice } = context
            const label = '1-step-rule'
            const policy = [['admin']]
            const credentials1 = await shield.createCredentialsForAddPolicy(
                label,
                policy
            )
            shield.executeCredentials(credentials1)
            const f = 'withdraw'
            const credentials2 = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                f,
                label
            )
            await shield.executeCredentials(credentials2)
            context = { ...context, wallet }
        })

        it('Should allow Alice to withdraw (1 step)', async function () {
            const { shield, wallet, alice } = context
            const credentials = await shield.createCredentials(
                wallet.address,
                'withdraw',
                [1000]
            )
            await shield.executeCredentials(credentials)
        })

        it('Should allow Alice to withdraw (2 steps)', async function () {
            const { shield, wallet, alice, bob, bobShield } = context
            const label = '2-steps-rule'
            const policy = [['employee'], ['admin']]
            const credentials1 = await shield.createCredentialsForAddPolicy(
                label,
                policy
            )
            await shield.executeCredentials(credentials1)
            const f = 'withdraw'
            const credentials2 = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                f,
                label
            )
            await shield.executeCredentials(credentials2)
            const credentials3 = await bobShield.createCredentials(
                wallet.address,
                'withdraw',
                [1000]
            )
            const credentials4 = await shield.approveCredentials(credentials3)
            await bobShield.executeCredentials(credentials4)
        })
    })

    describe('Without Shield', function () {
        it('Should allow to withdraw', async function () {
            const [alice] = await ethers.getSigners()
            const Wallet = await ethers.getContractFactory(
                'WalletExampleWithoutShield'
            )
            const balance = ethers.utils.parseEther('100')
            const wallet = await Wallet.connect(alice).deploy({
                value: balance,
            })
            await wallet.connect(alice).withdraw(1000)
        })
    })
})
