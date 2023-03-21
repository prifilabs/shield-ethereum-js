"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.Shield = exports.createShieldInstance = exports.createShield = exports.getAllShieldAddresses = exports.decodeCredentials = exports.encodeCredentials = exports.approveCredentials = exports.createCredentials = void 0;
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
            throw new Error("did not find role");
        num = bit_set(num, index);
    });
    return numberToBytes(num);
}
// https://stackoverflow.com/questions/69721296/how-to-encode-integer-to-uint8array-and-back-to-integer-in-javascript
function numberToBytes(number) {
    var buffer = new ArrayBuffer(8);
    var byteArray = new DataView(buffer);
    byteArray.setBigUint64(0, BigInt(number), false);
    return ethers_1.utils.hexlify(new Uint8Array(buffer));
}
function signData(signer, types, values) {
    var message = ethers_1.utils.arrayify(ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(types, values)));
    return signer.signMessage(message);
}
function getSigner(types, values, signature) {
    var message = ethers_1.utils.arrayify(ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode(types, values)));
    return ethers_1.utils.verifyMessage(message, signature);
}
function createCredentials(signer, to, fragment, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nullCredential, call, types, len, timestamp, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nullCredential = { to: ethers_1.constants.AddressZero, call: ethers_1.constants.HashZero, timestamp: 0, approvals: [] };
                    call = to.interface.encodeFunctionData(fragment, __spreadArray(__spreadArray([], args, true), [nullCredential], false));
                    types = to.interface.getFunction(fragment).inputs.map(function (input) {
                        return input.type;
                    });
                    types = types.slice(0, -1);
                    len = ethers_1.utils.defaultAbiCoder.encode(types, args).length;
                    call = call.slice(0, len + 8);
                    timestamp = Math.floor(new Date().getTime());
                    return [4 /*yield*/, signData(signer, ['address', 'bytes', 'uint'], [to.address, call, timestamp])];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, { to: to.address, call: call, timestamp: timestamp, approvals: [signature] }];
            }
        });
    });
}
exports.createCredentials = createCredentials;
function approveCredentials(signer, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var to, call, timestamp, approvals, lastSignature, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    to = credentials.to, call = credentials.call, timestamp = credentials.timestamp, approvals = credentials.approvals;
                    lastSignature = approvals[approvals.length - 1];
                    return [4 /*yield*/, signData(signer, ['bytes'], [lastSignature])];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, { to: to, call: call, timestamp: timestamp, approvals: __spreadArray(__spreadArray([], approvals, true), [signature], false) }];
            }
        });
    });
}
exports.approveCredentials = approveCredentials;
function encodeCredentials(credentials) {
    var to = credentials.to, call = credentials.call, timestamp = credentials.timestamp, approvals = credentials.approvals;
    return btoa(JSON.stringify({ to: to, call: call, timestamp: timestamp, approvals: approvals.map(btoa) }));
}
exports.encodeCredentials = encodeCredentials;
function decodeCredentials(encodedCredentials) {
    var _a = JSON.parse(atob(encodedCredentials)), to = _a.to, call = _a.call, timestamp = _a.timestamp, approvals = _a.approvals;
    return { to: to, call: call, timestamp: timestamp, approvals: approvals.map(atob) };
}
exports.decodeCredentials = decodeCredentials;
function parseEvents(name, tx) {
    return __awaiter(this, void 0, void 0, function () {
        var receipt, event, args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tx.wait()];
                case 1:
                    receipt = _a.sent();
                    event = receipt.events.find(function (event) { return event.event === name; });
                    args = event === null || event === void 0 ? void 0 : event.args;
                    return [2 /*return*/, args];
            }
        });
    });
}
function getAllShieldAddresses(signer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.getAllShieldAddresses = getAllShieldAddresses;
function createShield(signer, name, roles, users, policy, factory, shield) {
    return __awaiter(this, void 0, void 0, function () {
        var _name, _roles, _users, _policy, shieldTx, _a, _, address;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _name = ethers_1.utils.formatBytes32String(name);
                    _roles = roles.map(ethers_1.utils.formatBytes32String);
                    _users = users.map(function (user) {
                        var rolesAssigned = user.roles.map(ethers_1.utils.formatBytes32String);
                        return { addr: user.addr, roles: getBytesFromRoles(rolesAssigned, _roles) };
                    });
                    _policy = policy.map(function (step) {
                        var rolesAssigned = step.map(ethers_1.utils.formatBytes32String);
                        return getBytesFromRoles(rolesAssigned, _roles);
                    });
                    return [4 /*yield*/, factory.connect(signer).createShield(_name, _roles, _users, _policy)];
                case 1:
                    shieldTx = _b.sent();
                    return [4 /*yield*/, parseEvents("ShieldCreated", shieldTx)];
                case 2:
                    _a = _b.sent(), _ = _a[0], address = _a[1];
                    return [2 /*return*/, createShieldInstance(signer, address, shield)];
            }
        });
    });
}
exports.createShield = createShield;
function createShieldInstance(signer, address, shield) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            contract = new ethers_1.Contract(address, shield.interface, signer);
            return [2 /*return*/, new Shield(contract, signer)];
        });
    });
}
exports.createShieldInstance = createShieldInstance;
var Shield = /** @class */ (function () {
    function Shield(contract, signer) {
        this.contract = contract;
        this.signer = signer;
    }
    Shield.prototype.getRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [2 /*return*/, roles.map(ethers_1.utils.parseBytes32String)];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAddRoles = function (roles) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoles;
            return __generator(this, function (_a) {
                newRoles = roles.map(ethers_1.utils.formatBytes32String);
                return [2 /*return*/, createCredentials(this.signer, this.contract, "addRoles", [newRoles])];
            });
        });
    };
    Shield.prototype.addRoles = function (roles, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoles;
            return __generator(this, function (_a) {
                newRoles = roles.map(ethers_1.utils.formatBytes32String);
                return [2 /*return*/, this.contract.connect(this.signer).addRoles(newRoles, credentials)];
            });
        });
    };
    Shield.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Shield.prototype.getUser = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, bits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [4 /*yield*/, this.contract.getUser(address)];
                    case 2:
                        bits = _a.sent();
                        return [2 /*return*/, getRolesFromBytes(bits, roles).map(ethers_1.utils.parseBytes32String)];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForSetUser = function (address, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRoles, newRoles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        existingRoles = _a.sent();
                        newRoles = getBytesFromRoles(roles.map(ethers_1.utils.formatBytes32String), existingRoles);
                        return [2 /*return*/, createCredentials(this.signer, this.contract, "setUser", [address, newRoles])];
                }
            });
        });
    };
    Shield.prototype.setUser = function (address, roles, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRoles, newRoles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        existingRoles = _a.sent();
                        newRoles = getBytesFromRoles(roles.map(ethers_1.utils.formatBytes32String), existingRoles);
                        return [2 /*return*/, this.contract.connect(this.signer).setUser(address, newRoles, credentials)];
                }
            });
        });
    };
    Shield.prototype.getRules = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Shield.prototype.getRule = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [4 /*yield*/, this.contract.getRule(ethers_1.utils.formatBytes32String(label))];
                    case 2:
                        policy = _a.sent();
                        return [2 /*return*/, policy.map(function (bits) {
                                return getRolesFromBytes(bits, roles).map(ethers_1.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAddRule = function (label, policy) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, newLabel, newPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        newLabel = ethers_1.utils.formatBytes32String(label);
                        newPolicy = policy.map(function (step) {
                            return getBytesFromRoles(step.map(ethers_1.utils.formatBytes32String), roles);
                        });
                        return [2 /*return*/, createCredentials(this.signer, this.contract, "addRule", [newLabel, newPolicy])];
                }
            });
        });
    };
    Shield.prototype.addRule = function (label, policy, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, newLabel, newPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        newLabel = ethers_1.utils.formatBytes32String(label);
                        newPolicy = policy.map(function (step) {
                            return getBytesFromRoles(step.map(ethers_1.utils.formatBytes32String), roles);
                        });
                        return [2 /*return*/, this.contract.connect(this.signer).addRule(newLabel, newPolicy, credentials)];
                }
            });
        });
    };
    Shield.prototype.getAssignments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Shield.prototype.getAssignment = function (to, f) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, sig, policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        sig = to.interface.getSighash(f);
                        return [4 /*yield*/, this.contract.getAssignment(to.address, sig)];
                    case 2:
                        policy = _a.sent();
                        return [2 /*return*/, policy.map(function (bits) {
                                return getRolesFromBytes(bits, roles).map(ethers_1.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAssignRule = function (to, f, label) {
        return __awaiter(this, void 0, void 0, function () {
            var sig, newLabel;
            return __generator(this, function (_a) {
                sig = to.interface.getSighash(f);
                newLabel = ethers_1.utils.formatBytes32String(label);
                return [2 /*return*/, createCredentials(this.signer, this.contract, "assignRule", [to.address, sig, newLabel])];
            });
        });
    };
    Shield.prototype.assignRule = function (to, f, label, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var sig, newLabel;
            return __generator(this, function (_a) {
                sig = to.interface.getSighash(f);
                newLabel = ethers_1.utils.formatBytes32String(label);
                return [2 /*return*/, this.contract.connect(this.signer).assignRule(to.address, sig, newLabel, credentials)];
            });
        });
    };
    return Shield;
}());
exports.Shield = Shield;
