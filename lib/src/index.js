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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shield = exports.instantiateShield = exports.createShield = exports.getShields = exports.getShieldName = exports.executeCredentials = exports.decodeCredentials = exports.encodeCredentials = exports.approveCredentials = exports.createCredentials = exports.getDefaultFactory = void 0;
var ethers_1 = require("ethers");
var utils_1 = require("./utils");
var config_json_1 = __importDefault(require("./config.json"));
var Shield_json_1 = __importDefault(require("../artifacts/contracts/Shield.sol/Shield.json"));
var ShieldFactory_json_1 = __importDefault(require("../artifacts/contracts/ShieldFactory.sol/ShieldFactory.json"));
var SHIELD_INTERFACE = new ethers_1.ethers.utils.Interface(Shield_json_1.default.abi);
function getDefaultFactory(signer, network) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!(network in config_json_1.default))
                throw new Error("Shield Factory not deployed on ".concat(network));
            return [2 /*return*/, new ethers_1.ethers.Contract(config_json_1.default[network], ShieldFactory_json_1.default.abi, signer)];
        });
    });
}
exports.getDefaultFactory = getDefaultFactory;
function createCredentials(signer, to, func, args) {
    return __awaiter(this, void 0, void 0, function () {
        var chainid, call, timestamp, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signer.getChainId()];
                case 1:
                    chainid = _a.sent();
                    call = (0, utils_1.encodeCallData)(func, args, to.interface);
                    timestamp = Math.floor(new Date().getTime());
                    return [4 /*yield*/, (0, utils_1.signData)(signer, ['uint', 'uint', 'address', 'bytes'], [timestamp, chainid, to.address, call])];
                case 2:
                    signature = _a.sent();
                    return [2 /*return*/, { timestamp: timestamp, chainid: chainid, to: to.address, call: call, approvals: [signature] }];
            }
        });
    });
}
exports.createCredentials = createCredentials;
function approveCredentials(signer, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, chainid, to, call, approvals, lastSignature, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timestamp = credentials.timestamp, chainid = credentials.chainid, to = credentials.to, call = credentials.call, approvals = credentials.approvals;
                    lastSignature = approvals[approvals.length - 1];
                    return [4 /*yield*/, (0, utils_1.signData)(signer, ['bytes'], [lastSignature])];
                case 1:
                    signature = _a.sent();
                    return [2 /*return*/, {
                            timestamp: timestamp,
                            chainid: chainid,
                            to: to,
                            call: call,
                            approvals: __spreadArray(__spreadArray([], approvals, true), [signature], false),
                        }];
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
    var _a = JSON.parse(atob(encodedCredentials)), timestamp = _a.timestamp, chainid = _a.chainid, to = _a.to, call = _a.call, approvals = _a.approvals;
    return { timestamp: timestamp, chainid: chainid, to: to, call: call, approvals: approvals.map(atob) };
}
exports.decodeCredentials = decodeCredentials;
function executeCredentials(signer, credentials, iface, options) {
    if (typeof options === 'undefined') {
        options = {};
    }
    var contract = new ethers_1.ethers.Contract(credentials.to, iface, signer);
    var _a = (0, utils_1.decodeCallData)(credentials.call, iface), func = _a.func, args = _a.args;
    return contract[func].apply(this, __spreadArray(__spreadArray([], args, true), [credentials], false), options);
}
exports.executeCredentials = executeCredentials;
function getShieldName(address, factory) {
    return __awaiter(this, void 0, void 0, function () {
        var events, _i, events_1, event_1, _a, _, addr, name_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, factory.queryFilter('ShieldCreated', 0, 'latest')];
                case 1:
                    events = _b.sent();
                    for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                        event_1 = events_1[_i];
                        _a = event_1.args, _ = _a[0], addr = _a[1], name_1 = _a[2];
                        if (address == addr) {
                            return [2 /*return*/, ethers_1.ethers.utils.parseBytes32String(name_1)];
                        }
                    }
                    throw new Error("cannot find a shield deployed at ".concat(address));
            }
        });
    });
}
exports.getShieldName = getShieldName;
function getShields(address, factory) {
    return __awaiter(this, void 0, void 0, function () {
        var events, shields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, factory.queryFilter('UserAdded', 0, 'latest')];
                case 1:
                    events = _a.sent();
                    shields = new Set();
                    events.forEach(function (event) {
                        var _a = event.args, shield = _a[0], user = _a[1];
                        if (user === address) {
                            shields.add(shield);
                        }
                    });
                    return [2 /*return*/, Array.from(shields)];
            }
        });
    });
}
exports.getShields = getShields;
function createShield(signer, name, roles, users, policy, factory) {
    return __awaiter(this, void 0, void 0, function () {
        var _name, _roles, _users, _policy, tx, receipt, event, _a, _, address;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _name = ethers_1.ethers.utils.formatBytes32String(name);
                    _roles = roles.map(ethers_1.ethers.utils.formatBytes32String);
                    _users = users.map(function (user) {
                        var rolesAssigned = user.roles.map(ethers_1.ethers.utils.formatBytes32String);
                        return {
                            addr: user.addr,
                            roles: (0, utils_1.getBytesFromRoles)(rolesAssigned, _roles),
                        };
                    });
                    _policy = policy.map(function (step) {
                        var rolesAssigned = step.map(ethers_1.ethers.utils.formatBytes32String);
                        return (0, utils_1.getBytesFromRoles)(rolesAssigned, _roles);
                    });
                    return [4 /*yield*/, factory
                            .connect(signer)
                            .createShield(_name, _roles, _users, _policy)];
                case 1:
                    tx = _c.sent();
                    return [4 /*yield*/, tx.wait()];
                case 2:
                    receipt = _c.sent();
                    event = receipt.events.find(function (event) { return event.event === 'ShieldCreated'; });
                    _a = event === null || event === void 0 ? void 0 : event.args, _ = _a[0], address = _a[1];
                    _b = { tx: tx };
                    return [4 /*yield*/, instantiateShield(signer, address)];
                case 3: return [2 /*return*/, (_b.shield = _c.sent(), _b)];
            }
        });
    });
}
exports.createShield = createShield;
function instantiateShield(signer, address) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            contract = new ethers_1.ethers.Contract(address, SHIELD_INTERFACE, signer);
            return [2 /*return*/, new Shield(contract)];
        });
    });
}
exports.instantiateShield = instantiateShield;
var Shield = /** @class */ (function () {
    function Shield(contract) {
        this.contract = contract;
        this.abis = {};
        this.abis[contract.address] = contract.interface;
    }
    Shield.prototype.addInterface = function (address, iface) {
        this.abis[address] = iface;
    };
    Shield.prototype.getRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [2 /*return*/, roles.map(ethers_1.ethers.utils.parseBytes32String)];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAddRoles = function (signer, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoles;
            return __generator(this, function (_a) {
                newRoles = roles.map(ethers_1.ethers.utils.formatBytes32String);
                return [2 /*return*/, createCredentials(signer, this.contract, 'addRoles', [newRoles])];
            });
        });
    };
    Shield.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, roles, users, _i, events_2, event_2, _a, user, bits;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.contract.queryFilter('UserSet', 0, 'latest')];
                    case 1:
                        events = _b.sent();
                        return [4 /*yield*/, this.contract.getRoles()];
                    case 2:
                        roles = _b.sent();
                        users = {};
                        for (_i = 0, events_2 = events; _i < events_2.length; _i++) {
                            event_2 = events_2[_i];
                            _a = event_2.args, user = _a[0], bits = _a[1];
                            users[user] = (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                        }
                        return [2 /*return*/, users];
                }
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
                        return [2 /*return*/, (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String)];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForSetUser = function (signer, address, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRoles, newRoles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        existingRoles = _a.sent();
                        newRoles = (0, utils_1.getBytesFromRoles)(roles.map(ethers_1.ethers.utils.formatBytes32String), existingRoles);
                        return [2 /*return*/, createCredentials(signer, this.contract, 'setUser', [
                                address,
                                newRoles,
                            ])];
                }
            });
        });
    };
    Shield.prototype.getPolicies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, roles, policies, _i, events_3, event_3, _a, label, policy, decodedLabel, decodedPolicy;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.contract.queryFilter('PolicyAdded', 0, 'latest')];
                    case 1:
                        events = _b.sent();
                        return [4 /*yield*/, this.contract.getRoles()];
                    case 2:
                        roles = _b.sent();
                        policies = {};
                        for (_i = 0, events_3 = events; _i < events_3.length; _i++) {
                            event_3 = events_3[_i];
                            _a = event_3.args, label = _a[0], policy = _a[1];
                            decodedLabel = ethers_1.ethers.utils.parseBytes32String(label);
                            decodedPolicy = policy.map(function (bits) {
                                return (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                            });
                            policies[decodedLabel] = decodedPolicy;
                        }
                        return [2 /*return*/, policies];
                }
            });
        });
    };
    Shield.prototype.getPolicy = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [4 /*yield*/, this.contract.getPolicy(ethers_1.ethers.utils.formatBytes32String(label))];
                    case 2:
                        policy = _a.sent();
                        return [2 /*return*/, policy.map(function (bits) {
                                return (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAddPolicy = function (signer, label, policy) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, newLabel, newPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        newLabel = ethers_1.ethers.utils.formatBytes32String(label);
                        newPolicy = policy.map(function (step) {
                            return (0, utils_1.getBytesFromRoles)(step.map(ethers_1.ethers.utils.formatBytes32String), roles);
                        });
                        return [2 /*return*/, createCredentials(signer, this.contract, 'addPolicy', [
                                newLabel,
                                newPolicy,
                            ])];
                }
            });
        });
    };
    Shield.prototype.getAssignedPolicies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, assignments, _i, events_4, event_4, _a, to, sig, label, decodedLabel, f;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.contract.queryFilter('PolicyAssigned', 0, 'latest')];
                    case 1:
                        events = _b.sent();
                        assignments = {};
                        for (_i = 0, events_4 = events; _i < events_4.length; _i++) {
                            event_4 = events_4[_i];
                            _a = event_4.args, to = _a[0], sig = _a[1], label = _a[2];
                            if (!(to in assignments)) {
                                assignments[to] = {};
                            }
                            decodedLabel = ethers_1.ethers.utils.parseBytes32String(label);
                            f = to in this.abis ? this.abis[to].getFunction(sig).name : sig;
                            assignments[to][f] = decodedLabel;
                        }
                        return [2 /*return*/, assignments];
                }
            });
        });
    };
    Shield.prototype.getAssignedPolicy = function (to, func) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, sig, policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(to in this.abis)) {
                            throw new Error("unknown abi for ".concat(to));
                        }
                        return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        sig = this.abis[to].getSighash(func);
                        return [4 /*yield*/, this.contract.getAssignedPolicy(to, sig)];
                    case 2:
                        policy = _a.sent();
                        return [2 /*return*/, policy.map(function (bits) {
                                return (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAssignPolicy = function (signer, to, func, label) {
        return __awaiter(this, void 0, void 0, function () {
            var sig, newLabel;
            return __generator(this, function (_a) {
                if (!(to in this.abis)) {
                    throw new Error("unknown abi for ".concat(to));
                }
                sig = this.abis[to].getSighash(func);
                newLabel = ethers_1.ethers.utils.formatBytes32String(label);
                return [2 /*return*/, createCredentials(signer, this.contract, 'assignPolicy', [
                        to,
                        sig,
                        newLabel,
                    ])];
            });
        });
    };
    Shield.prototype.isPaused = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.paused()];
            });
        });
    };
    Shield.prototype.createCredentialsForPause = function (signer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, createCredentials(signer, this.contract, 'pause', [])];
            });
        });
    };
    Shield.prototype.createCredentialsForUnpause = function (signer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, createCredentials(signer, this.contract, 'unpause', [])];
            });
        });
    };
    Shield.prototype.createCredentialsForTransfer = function (signer, to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, createCredentials(signer, this.contract, 'transfer', [
                        to,
                        amount,
                    ])];
            });
        });
    };
    Shield.prototype.burnCredentials = function (signer, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.connect(signer).burnCredentials(credentials)];
            });
        });
    };
    Shield.prototype.checkCredentials = function (credentials, full) {
        return __awaiter(this, void 0, void 0, function () {
            var signer, sig, signers, _a, func, args;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        full = typeof full === 'undefined' ? false : full;
                        return [4 /*yield*/, (0, utils_1.getSigner)(['uint', 'uint', 'address', 'bytes'], [
                                credentials.timestamp,
                                credentials.chainid,
                                credentials.to,
                                credentials.call,
                            ], credentials.approvals[0])];
                    case 1:
                        signer = _b.sent();
                        sig = credentials.call.slice(0, 10);
                        return [4 /*yield*/, this.contract.validateCredentials(credentials, signer, credentials.to, sig, credentials.call, full)];
                    case 2:
                        signers = _b.sent();
                        _a = credentials.to in this.abis
                            ? (0, utils_1.decodeCallData)(credentials.call, this.abis[credentials.to])
                            : { func: sig, args: [credentials.call.slice(10)] }, func = _a.func, args = _a.args;
                        return [2 /*return*/, {
                                chainid: credentials.chainid,
                                timestamp: credentials.timestamp,
                                to: credentials.to,
                                func: func,
                                args: args,
                                approvals: signers,
                            }];
                }
            });
        });
    };
    Shield.prototype.executeCredentials = function (signer, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, executeCredentials(signer, credentials, this.contract.interface)];
            });
        });
    };
    return Shield;
}());
exports.Shield = Shield;
