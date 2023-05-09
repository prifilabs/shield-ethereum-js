import { ethers } from 'ethers'
import { getRolesFromBytes } from './utils'

export async function getShieldCreated(factory, first, last) {
    let events = await factory.queryFilter('ShieldCreated', first, last)
    let shields = {}
    for (let event of events) {
        const [_, addr, name] = event.args
        shields[addr] = ethers.utils.parseBytes32String(name)
    }
    return shields
}

export async function getRolesAdded(shield, first, last) {
    let events = await shield.queryFilter('RolesAdded', first, last)
    let roles = []
    for (let event of events) {
        const [l] = event.args
        roles = roles.concat(l)
    }
    return roles
}

export async function getUsersSet(shield, first, last, roles) {
    let events = await shield.queryFilter('UsersSet', first, last)
    const users = {}
    for (let event of events) {
        const [_users] = event.args
        for (let user of _users) {
            const [addr, bits] = user
            users[addr] = getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        }
    }
    return users
}

export async function getPolicyAdded(shield, first, last, roles) {
    let events = await shield.queryFilter('PolicyAdded', first, last)
    const policies = {}
    for (let event of events) {
        const [label, policy] = event.args
        const decodedLabel = ethers.utils.parseBytes32String(label)
        const decodedPolicy = policy.map(function (bits: any) {
            return getRolesFromBytes(bits, roles).map(
                ethers.utils.parseBytes32String
            )
        })
        policies[decodedLabel] = decodedPolicy
    }
    return policies
}

export async function getPolicyAssigned(shield, first, last) {
    let events = await shield.queryFilter('PolicyAssigned', first, last)
    const assignments = {}
    for (let event of events) {
        const [to, sig, label] = event.args
        if (!(to in assignments)) {
            assignments[to] = {}
        }
        const decodedLabel = ethers.utils.parseBytes32String(label)
        assignments[to][sig] = decodedLabel
    }
    return assignments
}
