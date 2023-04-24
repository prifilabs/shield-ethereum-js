import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

import {
    Utils,
    Store,
    Shield,
    createShield,
    instantiateShield,
    getShields,
    getDefaultFactory,
} from '../src/index'

import CONFIG from '../src/config.json'

describe('Shield', function () {
    async function deployFactoryFixture() {
        const [owner, alice, bob] = await ethers.getSigners()
        const FactoryContractFactory = await ethers.getContractFactory(
            'ShieldFactory'
        )
        const factory = await FactoryContractFactory.deploy()
        return { factory, alice, bob }
    }

    let context

    describe('Deployment', function () {
        it('Should deploy', async function () {
            const { factory, alice, bob } = await loadFixture(
                deployFactoryFixture
            )
            // Store.ServerStore.setServer("http://localhost:4000");
            // const store = Store.getServerStore;
            const store = undefined
            const { shield } = await createShield(
                alice,
                'MyShield',
                ['admin', 'employee'],
                [{ addr: alice.address, roles: ['admin', 'employee'] }],
                [['admin']],
                factory,
                store
            )
            const { shield: badShield } = await createShield(
                bob,
                'BadShield',
                ['admin'],
                [
                    { addr: alice.address, roles: ['admin'] },
                    { addr: bob.address, roles: ['admin'] },
                ],
                [['admin']],
                factory,
                store
            )
            const bobShield = await instantiateShield(
                bob,
                shield.contract.address,
                store
            )
            context = { factory, shield, badShield, bobShield, alice, bob }
        })

        it('Should get the deployed factories', async function () {
            const { alice } = context
            const sepoliaFactory = await getDefaultFactory(alice, 'sepolia')
            expect(sepoliaFactory.address).to.equal(CONFIG.sepolia)
        })

        it('Should get all deployed shields', async function () {
            const { factory, shield, badShield, alice, bob } = context
            const aliceShields = await getShields(alice, factory)
            expect(aliceShields).to.have.property(
                shield.contract.address,
                'MyShield'
            )
            expect(aliceShields).to.have.property(
                badShield.contract.address,
                'BadShield'
            )
            const bobShields = await getShields(bob, factory)
            expect(bobShields).not.to.have.property(
                shield.contract.address,
                'MyShield'
            )
            expect(bobShields).to.have.property(
                badShield.contract.address,
                'BadShield'
            )
        })

        it('Should get all shieldables', async function () {
            const { shield, alice } = context
            expect(await shield.getShieldables()).to.have.members([])
        })

        it('Should get all roles', async function () {
            const { shield, alice } = context
            expect(await shield.getRoles()).to.have.members([
                'admin',
                'employee',
            ])
        })

        it('Should get all users', async function () {
            const { shield, alice } = context
            expect(await shield.getUsers())
                .to.have.property(alice.address)
                .which.have.members(['admin', 'employee'])
        })

        it('Should get roles for a user', async function () {
            const { shield, alice } = context
            expect(await shield.getUser(alice.address)).to.have.members([
                'admin',
                'employee',
            ])
        })

        it('Should get all policies', async function () {
            const { shield, alice } = context
            expect(await shield.getPolicies())
                .to.have.property('admin-policy')
                .which.deep.equal([['admin']])
        })

        it('Should get the admin policy', async function () {
            const { shield, alice } = context
            expect(await shield.getPolicy('admin-policy')).to.deep.equal([
                ['admin'],
            ])
        })

        it('Should get all assignments', async function () {
            const { shield, alice } = context
            // for (let f of [
            //     'addRoles',
            //     'setUsers',
            //     'addPolicy',
            //     'assignPolicy',
            //     'pause',
            //     'unpause',
            //     'transfer',
            // ]) {
            //     console.log(await shield.contract.interface.getSighash(f));
            // };
            const assignments = await shield.getAssignedPolicies()
            expect(assignments).to.have.property(shield.contract.address)
            for (let f of [
                'addRoles',
                'setUsers',
                'addPolicy',
                'assignPolicy',
                'pause',
                'unpause',
                'transfer',
            ]) {
                expect(assignments[shield.contract.address]).to.have.property(
                    Utils.getFunction(f, shield.contract.interface),
                    'admin-policy'
                )
            }
        })

        it('Should get the admin assignments', async function () {
            const { shield, alice } = context
            for (let f of [
                'addRoles',
                'setUsers',
                'addPolicy',
                'assignPolicy',
                'pause',
                'unpause',
                'transfer',
            ]) {
                expect(
                    await shield.getAssignedPolicy(shield.contract.address, f)
                ).to.deep.equal([['admin']])
            }
        })

        it('Should be unpause', async function () {
            const { shield, alice } = context
            expect(await shield.isPaused()).to.be.false
        })
    })

    describe('Admin', function () {
        it('Should add a role', async function () {
            const { shield, alice } = context
            const oldRoles = await shield.getRoles()
            const newRoles = ['engineer']
            const credentials = await shield.createCredentialsForAddRoles(
                newRoles
            )
            await shield.executeCredentials(credentials)
            expect(await shield.getRoles()).to.have.members([
                ...oldRoles,
                ...newRoles,
            ])
        })

        it('Should set a user', async function () {
            const { shield, alice, bob } = context
            const roles = ['employee', 'engineer']
            const credentials = await shield.createCredentialsForSetUsers([
                { address: bob.address, roles },
            ])
            await shield.executeCredentials(credentials)
            expect(await shield.getUser(bob.address)).to.have.members(roles)
            const users = await shield.getUsers()
            expect(users)
                .to.have.property(alice.address)
                .which.have.members(['admin', 'employee'])
            expect(users)
                .to.have.property(bob.address)
                .which.have.members(['employee', 'engineer'])
        })

        it('Should add a policy', async function () {
            const { shield, alice } = context
            const label = 'everybody'
            const policy = [['admin', 'employee', 'engineer']]
            const credentials = await shield.createCredentialsForAddPolicy(
                label,
                policy
            )
            await shield.executeCredentials(credentials)
            expect(await shield.getPolicy(label)).to.deep.equal(policy)
        })

        it('Should set an assignment', async function () {
            const { shield, alice } = context
            const f = 'pause'
            const label = 'everybody'
            const credentials = await shield.createCredentialsForAssignPolicy(
                shield.contract.address,
                f,
                label
            )
            await shield.executeCredentials(credentials)
            const policy = await shield.getPolicy(label)
            expect(
                await shield.getAssignedPolicy(shield.contract.address, f)
            ).to.deep.equal(policy)
        })

        it('Should add a policy and set an assignment', async function () {
            const { shield, alice } = context
            const label = 'two-step'
            const policy = [['employee'], ['admin']]
            const credentials1 = await shield.createCredentialsForAddPolicy(
                label,
                policy
            )
            await shield.executeCredentials(credentials1)
            expect(await shield.getPolicy(label)).to.deep.equal(policy)
            const f = 'unpause'
            const credentials2 = await shield.createCredentialsForAssignPolicy(
                shield.contract.address,
                f,
                label
            )
            await shield.executeCredentials(credentials2)
            expect(
                await shield.getAssignedPolicy(shield.contract.address, f)
            ).to.deep.equal(policy)
        })

        it('Should pause the shield', async function () {
            const { bobShield, bob } = context
            const credentials = await bobShield.createCredentialsForPause()
            await bobShield.executeCredentials(credentials)
            expect(await bobShield.isPaused()).to.be.true
        })

        it('Should not be able to call anything but unpause', async function () {
            const { bobShield, bob } = context
            const credentials = await bobShield.createCredentialsForPause()
            await expect(
                bobShield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                bobShield.contract,
                'InvalidCredentials'
            )
        })

        it('Should unpause the shield', async function () {
            const { shield, alice, bobShield, bob } = context
            const credentials1 = await bobShield.createCredentialsForUnpause()
            await expect(
                bobShield.executeCredentials(credentials1)
            ).to.be.revertedWithCustomError(
                bobShield.contract,
                'InvalidCredentials'
            )
            const credentials2 = await shield.approveCredentials(credentials1)
            await bobShield.executeCredentials(credentials2)
            expect(await bobShield.isPaused()).to.be.false
        })

        it('Should transfer eth', async function () {
            const { shield, alice } = context
            const amount = ethers.utils.parseEther('1.0')
            await alice.sendTransaction({
                to: shield.contract.address,
                value: amount,
            })
            const credentials = await shield.createCredentialsForTransfer(
                alice.address,
                amount
            )
            expect(await shield.executeCredentials(credentials))
                .to.changeEtherBalance(alice, amount)
                .and.to.changeEtherBalance(shield, -amount)
        })

        it('Should check a credential', async function () {
            const { shield, alice } = context
            const credentials = await shield.createCredentialsForPause()
            const { to, func, timestamp, approvals } =
                await shield.checkCredentials(credentials)
            expect(to).to.equal(shield.contract.address)
            expect(func).to.equal('pause')
            expect(timestamp).to.be.above(0)
            expect(approvals).to.have.members([alice.address])
            const credentials2 = await shield.createCredentialsForAddRoles([
                'new',
            ])
            const { args } = await shield.checkCredentials(credentials2)
            expect(args).to.deep.equal([
                [ethers.utils.formatBytes32String('new')],
            ])
        })

        it('Should cancel a credential', async function () {
            const { shield, alice } = context
            const credentials = await shield.createCredentialsForPause()
            expect(await shield.isCanceled(credentials)).to.be.false
            await shield.cancelCredentials(credentials)
            expect(await shield.isCanceled(credentials)).to.be.true
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })
    })

    describe('Rejections', function () {
        it.skip('Should reject if not allowed', async function () {
            const { bobShield, bob } = context
            const credentials =
                await bobShield.createCredentialsForAssignPolicy(
                    bobShield.contract.address,
                    'unpause',
                    'everybody'
                )
            await expect(
                bobShield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                bobShield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if the contract address is different', async function () {
            const { shield, badShield, bob } = context
            const roles = ['role']
            const credentials = await badShield.createCredentialsForAddRoles(
                roles
            )
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if the sender is not the signer', async function () {
            const { shield, alice, bob } = context
            const roles = ['maybe']
            const credentials = await shield.createCredentialsForAddRoles(roles)
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        // not sure how to test that with the new executeCredentials
        it.skip('Should reject if the function is different', async function () {
            const { shield, alice } = context
            const credentials = await shield.createCredentialsForAddRoles([
                'another-role',
            ])
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if approvals is empty', async function () {
            const { shield, alice, bob } = context
            const credentials = await shield.createCredentialsForSetUsers([
                { address: bob.address, roles: [] },
            ])
            credentials.approvals = []
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if credentials signed twice', async function () {
            const { shield, alice } = context
            const credentials1 = await shield.createCredentialsForUnpause(alice)
            const credentials2 = await shield.approveCredentials(
                alice,
                credentials1
            )
            await expect(
                shield.executeCredentials(credentials2)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if credentials are used twice', async function () {
            const { shield, alice } = context
            const roles = ['maybe']
            const credentials = await shield.createCredentialsForAddRoles(
                alice,
                roles
            )
            shield.executeCredentials(credentials)
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(
                shield.contract,
                'InvalidCredentials'
            )
        })

        it.skip('Should reject if add more than 64 roles to shield', async function () {
            const { shield, alice } = context
            const roles = Array(65).fill('maybe')
            const credentials = await shield.createCredentialsForAddRoles(
                alice,
                roles
            )
            await expect(shield.executeCredentials(credentials)).to.be.reverted
        })

        it.skip('Should reject if create shield with more than 64 roles', async function () {
            const { factory, alice } = context
            const roles = Array(65).fill('admin')
            await expect(
                createShield(
                    alice,
                    'MyShield',
                    roles,
                    [{ addr: alice.address, roles: ['admin'] }],
                    [['admin']],
                    factory
                )
            ).to.be.reverted
        })

        it.skip('Should reject if bad policy', async function () {
            const { shield, alice } = context
            let label = ''
            const policy = []
            let credentials = await shield.createCredentialsForAddPolicy(
                alice,
                label,
                policy
            )
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(shield.contract, 'ShieldError')
            label = 'admin-policy'
            credentials = await shield.createCredentialsForAddPolicy(
                alice,
                label,
                policy
            )
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(shield.contract, 'ShieldError')
            label = 'good-label'
            credentials = await shield.createCredentialsForAddPolicy(
                alice,
                label,
                policy
            )
            await expect(
                shield.executeCredentials(credentials)
            ).to.be.revertedWithCustomError(shield.contract, 'ShieldError')
        })
    })

    describe('Storage', function () {
        let credentials

        it('Should get all credentials', async function () {
            const { shield } = context
            credentials = await shield.getCredentials()
            expect(credentials).not.be.empty
        })
        it('Should get all hashes', async function () {
            const { shield } = context
            for (let c of credentials) {
                if (await shield.isExecuted(c)) {
                    expect(await shield.getTransactionHash(c)).not.be.empty
                }
            }
        })
    })
})
