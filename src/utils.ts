import { Signer, constants, utils } from 'ethers'

import { Credentials } from './types'

export function signData(signer: Signer, types: string[], values: any[]) {
    let message = utils.arrayify(
        utils.keccak256(utils.defaultAbiCoder.encode(types, values))
    )
    return signer.signMessage(message)
}

export function getSigner(types: string[], values: any[], signature: string) {
    let message = utils.arrayify(
        utils.keccak256(utils.defaultAbiCoder.encode(types, values))
    )
    return utils.verifyMessage(message, signature)
}

export function getSignature(func, iface) {
    return iface.getSighash(func)
}

export function getFunction(sig, iface) {
    return iface.getFunction(sig).format(utils.FormatTypes.full)
}

export function encodeCallData(func, args, iface) {
    return iface.encodeFunctionData(func, args)
}

export function decodeCallData(call, iface) {
    const sig = call.slice(0, 10)
    const func = iface.getFunction(sig).name
    let args = iface.decodeFunctionData(func, call)
    return { func, args }
}

export function encodeCredentials(credentials: Credentials): string {
    const { timestamp, chainid, to, call, approvals } = credentials

    return btoa(
        JSON.stringify({
            timestamp,
            chainid,
            to,
            call,
            approvals: approvals.map(btoa),
        })
    )
}

export function decodeCredentials(encodedCredentials: string): Credentials {
    const { timestamp, chainid, to, call, approvals } = JSON.parse(
        atob(encodedCredentials)
    )
    return { timestamp, chainid, to, call, approvals: approvals.map(atob) }
}

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function bytesToNumber(bytes: number | utils.BytesLike | utils.Hexable) {
    let byteArray = utils.arrayify(bytes)
    let result = 0
    for (let i = 0; i < byteArray.length; i++) {
        result = result * 256 + byteArray[i]
    }

    return result
}

export function getRolesFromBytes(bytes: any, allRoles: any[]) {
    let total = bytesToNumber(bytes)
    let roles = allRoles.filter((_: any, index: any) => {
        return bit_test(total, index)
    })
    return roles
}

// https://stackoverflow.com/a/8436459/9894569
function bit_test(num: number, bit: number) {
    return (num >> bit) % 2 != 0
}

function bit_set(num: number, bit: number) {
    return num | (1 << bit)
}

export function getBytesFromRoles(roles: any[], allRoles: any[]) {
    let num = 0
    roles.forEach((role: any) => {
        const index = allRoles.findIndex((val: any) => val === role)
        if (index === -1) throw new Error('did not find role')
        num = bit_set(num, index)
    })
    return numberToBytes(num)
}

// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function numberToBytes(number: string | number | bigint | boolean) {
    const buffer = new ArrayBuffer(8)
    const byteArray = new DataView(buffer)
    byteArray.setBigUint64(0, BigInt(number), false)
    return utils.hexlify(new Uint8Array(buffer))
}
