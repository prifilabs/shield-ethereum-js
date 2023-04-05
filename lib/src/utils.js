"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBytesFromRoles = exports.getRolesFromBytes = exports.decodeCallData = exports.encodeCallData = exports.getSigner = exports.signData = void 0;
var ethers_1 = require("ethers");
function signData(signer, types, values) {
    var message = ethers_1.utils.arrayify(ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(types, values)));
    return signer.signMessage(message);
}
exports.signData = signData;
function getSigner(types, values, signature) {
    var message = ethers_1.utils.arrayify(ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(types, values)));
    return ethers_1.utils.verifyMessage(message, signature);
}
exports.getSigner = getSigner;
function getNullCredential() {
    return {
        timestamp: 0,
        chainid: 0,
        to: ethers_1.constants.AddressZero,
        call: ethers_1.constants.HashZero,
        approvals: [],
    };
}
function getNullCredentialEncoded() {
    return ethers_1.utils.defaultAbiCoder.encode(['uint', 'uint', 'address', 'bytes', 'bytes[]'], [
        0,
        0,
        ethers_1.constants.AddressZero,
        ethers_1.constants.HashZero,
        [],
    ]);
}
function encodeCallData(func, args, iface) {
    var call = iface.encodeFunctionData(func, __spreadArray(__spreadArray([], args, true), [getNullCredential()], false));
    return call.slice(0, call.length - (getNullCredentialEncoded().length - 2));
}
exports.encodeCallData = encodeCallData;
function decodeCallData(call, iface) {
    var sig = call.slice(0, 10);
    var func = iface.getFunction(sig).name;
    var args = iface.decodeFunctionData(func, ethers_1.utils.hexConcat([call, getNullCredentialEncoded()]));
    args = args.slice(0, -1);
    return { func: func, args: args };
}
exports.decodeCallData = decodeCallData;
// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function bytesToNumber(bytes) {
    var byteArray = ethers_1.utils.arrayify(bytes);
    var result = 0;
    for (var i = 0; i < byteArray.length; i++) {
        result = result * 256 + byteArray[i];
    }
    return result;
}
function getRolesFromBytes(bytes, allRoles) {
    var total = bytesToNumber(bytes);
    var roles = allRoles.filter(function (_, index) {
        return bit_test(total, index);
    });
    return roles;
}
exports.getRolesFromBytes = getRolesFromBytes;
// https://stackoverflow.com/a/8436459/9894569
function bit_test(num, bit) {
    return (num >> bit) % 2 != 0;
}
function bit_set(num, bit) {
    return num | (1 << bit);
}
function getBytesFromRoles(roles, allRoles) {
    var num = 0;
    roles.forEach(function (role) {
        var index = allRoles.findIndex(function (val) { return val === role; });
        if (index === -1)
            throw new Error('did not find role');
        num = bit_set(num, index);
    });
    return numberToBytes(num);
}
exports.getBytesFromRoles = getBytesFromRoles;
// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function numberToBytes(number) {
    var buffer = new ArrayBuffer(8);
    var byteArray = new DataView(buffer);
    byteArray.setBigUint64(0, BigInt(number), false);
    return ethers_1.utils.hexlify(new Uint8Array(buffer));
}
