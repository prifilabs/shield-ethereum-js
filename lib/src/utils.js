"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBytesFromRoles = exports.getRolesFromBytes = exports.decodeCredentials = exports.encodeCredentials = exports.decodeCallData = exports.encodeCallData = exports.getFunction = exports.getSignature = exports.getSigner = exports.signData = void 0;
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
function getSignature(func, iface) {
    return iface.getSighash(func);
}
exports.getSignature = getSignature;
function getFunction(sig, iface) {
    return iface.getFunction(sig).format(ethers_1.utils.FormatTypes.full);
}
exports.getFunction = getFunction;
function encodeCallData(func, args, iface) {
    return iface.encodeFunctionData(func, args);
}
exports.encodeCallData = encodeCallData;
function decodeCallData(call, iface) {
    var sig = call.slice(0, 10);
    var func = iface.getFunction(sig).name;
    var args = iface.decodeFunctionData(func, call);
    return { func: func, args: args };
}
exports.decodeCallData = decodeCallData;
function encodeCredentials(credentials) {
    var timestamp = credentials.timestamp, chainid = credentials.chainid, to = credentials.to, call = credentials.call, approvals = credentials.approvals;
    return btoa(JSON.stringify({
        timestamp: timestamp,
        chainid: chainid,
        to: to,
        call: call,
        approvals: approvals.map(btoa),
    }));
}
exports.encodeCredentials = encodeCredentials;
function decodeCredentials(encodedCredentials) {
    var _a = JSON.parse(atob(encodedCredentials)), timestamp = _a.timestamp, chainid = _a.chainid, to = _a.to, call = _a.call, approvals = _a.approvals;
    return { timestamp: timestamp, chainid: chainid, to: to, call: call, approvals: approvals.map(atob) };
}
exports.decodeCredentials = decodeCredentials;
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
