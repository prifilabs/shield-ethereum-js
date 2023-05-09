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

describe('Wallet Companion', function () {
    async function deployFactoryFixture() {
        const [alice] = await ethers.getSigners()
        const FactoryContractFactory = await ethers.getContractFactory(
            'ShieldFactory'
        )
        const factory = await FactoryContractFactory.deploy()
        return { factory, alice }
    }

    let context

    describe('Deployment', function () {
        it('Should deploy a shield', async function () {
            const { factory, alice } = await loadFixture(deployFactoryFixture)
            // Store.ServerStore.setServer("http://localhost:4000");
            // const store = Store.getServerStore;
            const store = undefined
            const name = 'MyShield'
            const roles = ['admin']
            const users = [{ addr: alice.address, roles: ['admin'] }]
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
            context = { shield, alice }
        })

        it('Should deploy a Wallet Companion', async function () {
            const { shield, alice } = context
            const Wallet = await ethers.getContractFactory('WalletCompanion')
            const balance = ethers.utils.parseEther('100')
            const wallet = await Wallet.connect(alice).deploy(
                shield.contract.address,
                { value: balance }
            )
            await shield.addShieldable(wallet.address, wallet.interface)
            context = { ...context, wallet }
        })

        it('Should create an admin policy', async function () {
            const { shield } = context
            const label = 'admin-rule'
            const policy = [['admin']]
            const credentials = await shield.createCredentialsForAddPolicy(
                label,
                policy
            )
            await shield.executeCredentials(credentials)
        })
    })

    describe('Eth', function () {
        it('Should protect transferEth', async function () {
            const { shield, wallet } = context
            const credentials = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                'transferEth',
                'admin-rule'
            )
            await shield.executeCredentials(credentials)
        })

        it('Should not allow Alice to withdraw Eth directly', async function () {
            const { wallet, alice } = context
            const amount = ethers.utils.parseEther('1.0')
            await expect(
                wallet.connect(alice).transferEth(alice.address, amount)
            ).to.be.reverted
        })

        it('Should allow Alice to withdraw eth', async function () {
            const { shield, wallet, alice } = context
            const amount = ethers.utils.parseEther('1.0')
            const credentials = await shield.createCredentials(
                wallet.address,
                'transferEth',
                [alice.address, amount]
            )
            expect(await shield.executeCredentials(credentials))
                .to.changeEtherBalance(alice, amount)
                .and.to.changeEtherBalance(shield, -amount)
        })
    })

    describe('ERC20', function () {
        it('Should configure the shield to protect the wallet', async function () {
            const { shield, wallet } = context
            const credentials = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                'transferERC20',
                'admin-rule'
            )
            await shield.executeCredentials(credentials)
        })

        it('Should deploy an ERC20', async function () {
            const { wallet, alice } = context
            const Erc20 = await ethers.getContractFactory('TestERC20')
            const erc20 = await Erc20.deploy(wallet.address, 1000)
            expect(await erc20.balanceOf(wallet.address)).to.eq(1000)
            context = { ...context, erc20 }
        })

        it('Should not allow Alice to withdraw ERC20 directly', async function () {
            const { wallet, alice, erc20 } = context
            await expect(
                wallet
                    .connect(alice)
                    .transferERC20(erc20.address, alice.address, 200)
            ).to.be.reverted
        })

        it('Should allow Alice to withdraw ERC20 through the Shield', async function () {
            const { shield, wallet, alice, erc20 } = context
            const credentials = await shield.createCredentials(
                wallet.address,
                'transferERC20',
                [erc20.address, alice.address, 200]
            )
            await shield.executeCredentials(credentials)
            expect(await erc20.balanceOf(alice.address)).to.eq(200)
            expect(await erc20.balanceOf(wallet.address)).to.eq(800)
        })
    })

    describe('ERC721', function () {
        it('Should configure the shield to protect the wallet', async function () {
            const { shield, wallet } = context
            const credentials = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                'transferERC721',
                'admin-rule'
            )
            await shield.executeCredentials(credentials)
        })

        it('Should deploy an ERC721', async function () {
            const { wallet, alice } = context
            const Erc721 = await ethers.getContractFactory('TestERC721')
            const erc721 = await Erc721.deploy(wallet.address)
            context = { ...context, erc721 }
        })

        it('Should not allow Alice to withdraw ERC721 directly', async function () {
            const { wallet, alice, erc721 } = context
            await expect(
                wallet
                    .connect(alice)
                    .transferERC721(erc721.address, alice.address, 0, [])
            ).to.be.reverted
        })

        it('Should allow Alice to withdraw ERC721 through the Shield', async function () {
            const { shield, wallet, alice, erc721 } = context
            const credentials = await shield.createCredentials(
                wallet.address,
                'transferERC721',
                [erc721.address, alice.address, 0, []]
            )
            await shield.executeCredentials(credentials)
            expect(await erc721.balanceOf(alice.address)).to.eq(1)
        })
    })

    describe('ERC1155', function () {
        it('Should configure the shield to protect the wallet', async function () {
            const { shield, wallet } = context
            const credentials = await shield.createCredentialsForAssignPolicy(
                wallet.address,
                'transferERC1155',
                'admin-rule'
            )
            await shield.executeCredentials(credentials)
        })

        it('Should deploy an ERC1155', async function () {
            const { wallet, alice } = context
            const Erc1155 = await ethers.getContractFactory('TestERC1155')
            const erc1155 = await Erc1155.deploy(wallet.address)
            context = { ...context, erc1155 }
        })

        it('Should not allow Alice to withdraw ERC1155 directly', async function () {
            const { wallet, alice, erc1155 } = context
            await expect(
                wallet
                    .connect(alice)
                    .transferERC721(erc1155.address, alice.address, 0, [])
            ).to.be.reverted
        })

        it('Should allow Alice to withdraw ERC1155 through the Shield', async function () {
            const { shield, wallet, alice, erc1155 } = context
            const credentials = await shield.createCredentials(
                wallet.address,
                'transferERC1155',
                [erc1155.address, alice.address, 0, 1, []]
            )
            await shield.executeCredentials(credentials)
            expect(await erc1155.balanceOf(alice.address, 0)).to.eq(1)
        })
    })
})
