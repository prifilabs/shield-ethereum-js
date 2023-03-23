"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBytesFromRoles = exports.getRolesFromBytes = void 0;
var ethers_1 = require("ethers");
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
