import { Signer, constants, utils } from 'ethers'

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

function getNullCredential() {
    return {
        timestamp: 0,
        chainid: 0,
        to: constants.AddressZero,
        call: constants.HashZero,
        approvals: [],
    }
}

function getNullCredentialEncoded() {
    return utils.defaultAbiCoder.encode(
        ['uint', 'uint', 'address', 'bytes', 'bytes[]'],
        [0, 0, constants.AddressZero, constants.HashZero, []]
    )
}

export function encodeCallData(func, args, iface) {
    const call = iface.encodeFunctionData(func, [...args, getNullCredential()])
    return call.slice(0, call.length - (getNullCredentialEncoded().length - 2))
}

export function decodeCallData(call, iface) {
    const sig = call.slice(0, 10)
    const func = iface.getFunction(sig).name
    let args = iface.decodeFunctionData(
        func,
        utils.hexConcat([call, getNullCredentialEncoded()])
    )
    args = args.slice(0, -1)
    return { func, args }
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
