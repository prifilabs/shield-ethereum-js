"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Shield = exports.instantiateShield = exports.createShield = exports.getShields = exports.getDefaultFactory = exports.Store = exports.Utils = void 0;
var ethers_1 = require("ethers");
var Utils = __importStar(require("./utils"));
exports.Utils = __importStar(require("./utils"));
var Store = __importStar(require("./store"));
exports.Store = __importStar(require("./store"));
var events_1 = require("./events");
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
function getShields(signer, factory) {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, shields, _a, _b, _c, _i, address, contract, roles, users;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, events_1.getShieldCreated)(factory, 0, 'latest')];
                case 1:
                    candidates = _d.sent();
                    shields = {};
                    _a = candidates;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 6];
                    address = _c;
                    contract = new ethers_1.ethers.Contract(address, SHIELD_INTERFACE, signer);
                    return [4 /*yield*/, contract.getRoles()];
                case 3:
                    roles = _d.sent();
                    return [4 /*yield*/, (0, events_1.getUsersSet)(contract, 0, 'latest', roles)];
                case 4:
                    users = _d.sent();
                    return [4 /*yield*/, signer.getAddress()];
                case 5:
                    if ((_d.sent()) in users) {
                        shields[address] = candidates[address];
                    }
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, shields];
            }
        });
    });
}
exports.getShields = getShields;
function createShield(signer, name, roles, users, policy, factory, storeClass) {
    return __awaiter(this, void 0, void 0, function () {
        var _name, _roles, _users, _policy, tx, receipt, event, _a, _, address, shield;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _name = ethers_1.ethers.utils.formatBytes32String(name);
                    _roles = roles.map(ethers_1.ethers.utils.formatBytes32String);
                    _users = users.map(function (user) {
                        var rolesAssigned = user.roles.map(ethers_1.ethers.utils.formatBytes32String);
                        return {
                            addr: user.addr,
                            roles: Utils.getBytesFromRoles(rolesAssigned, _roles),
                        };
                    });
                    _policy = policy.map(function (step) {
                        var rolesAssigned = step.map(ethers_1.ethers.utils.formatBytes32String);
                        return Utils.getBytesFromRoles(rolesAssigned, _roles);
                    });
                    return [4 /*yield*/, factory
                            .connect(signer)
                            .createShield(_name, _roles, _users, _policy)];
                case 1:
                    tx = _b.sent();
                    return [4 /*yield*/, tx.wait()];
                case 2:
                    receipt = _b.sent();
                    event = receipt.events.find(function (event) { return event.event === 'ShieldCreated'; });
                    _a = event === null || event === void 0 ? void 0 : event.args, _ = _a[0], address = _a[1];
                    return [4 /*yield*/, instantiateShield(signer, address, storeClass)];
                case 3:
                    shield = _b.sent();
                    return [2 /*return*/, { tx: tx, shield: shield }];
            }
        });
    });
}
exports.createShield = createShield;
function instantiateShield(signer, address, storeClass) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, shield;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contract = new ethers_1.ethers.Contract(address, SHIELD_INTERFACE, signer);
                    shield = new Shield(signer, contract);
                    return [4 /*yield*/, shield.initStorage(storeClass)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, shield.addInterface(shield.contract.address, SHIELD_INTERFACE)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, shield];
            }
        });
    });
}
exports.instantiateShield = instantiateShield;
var Shield = /** @class */ (function () {
    function Shield(signer, contract) {
        this.signer = signer;
        this.contract = contract;
    }
    Shield.prototype.initStorage = function (storeClass) {
        return __awaiter(this, void 0, void 0, function () {
            var network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.provider.getNetwork()];
                    case 1:
                        network = (_a.sent()).name;
                        if (typeof storeClass === 'undefined') {
                            if (network in config_json_1.default) {
                                storeClass = Store.getServerStore;
                            }
                            else {
                                storeClass = Store.getMemoryStore;
                            }
                        }
                        this.store = storeClass(network, this.contract.address);
                        return [2 /*return*/];
                }
            });
        });
    };
    Shield.prototype.addInterface = function (address, iface) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.addInterface(address, iface)];
            });
        });
    };
    Shield.prototype.getInterface = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.getInterface(address)];
            });
        });
    };
    Shield.prototype.getShieldables = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, events_1.getShieldableAdded)(this.contract, 0, 'latest')];
            });
        });
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
    Shield.prototype.createCredentialsForAddRoles = function (roles) {
        return __awaiter(this, void 0, void 0, function () {
            var newRoles;
            return __generator(this, function (_a) {
                newRoles = roles.map(ethers_1.ethers.utils.formatBytes32String);
                return [2 /*return*/, this.createCredentials(this.contract.address, 'addRoles', [
                        newRoles,
                    ])];
            });
        });
    };
    Shield.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [2 /*return*/, (0, events_1.getUsersSet)(this.contract, 0, 'latest', roles)];
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
                        return [2 /*return*/, Utils.getRolesFromBytes(bits, roles).map(ethers_1.ethers.utils.parseBytes32String)];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForSetUsers = function (users) {
        return __awaiter(this, void 0, void 0, function () {
            var existingRoles, newUsers, _i, users_1, user, newRoles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        existingRoles = _a.sent();
                        newUsers = [];
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            newRoles = Utils.getBytesFromRoles(user.roles.map(ethers_1.ethers.utils.formatBytes32String), existingRoles);
                            newUsers.push({ addr: user.address, roles: newRoles });
                        }
                        return [2 /*return*/, this.createCredentials(this.contract.address, 'setUsers', [
                                newUsers,
                            ])];
                }
            });
        });
    };
    Shield.prototype.getPolicies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [2 /*return*/, (0, events_1.getPolicyAdded)(this.contract, 0, 'latest', roles)];
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
                                return Utils.getRolesFromBytes(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAddPolicy = function (label, policy) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, newLabel, newPolicy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        newLabel = ethers_1.ethers.utils.formatBytes32String(label);
                        newPolicy = policy.map(function (step) {
                            return Utils.getBytesFromRoles(step.map(ethers_1.ethers.utils.formatBytes32String), roles);
                        });
                        return [2 /*return*/, this.createCredentials(this.contract.address, 'addPolicy', [
                                newLabel,
                                newPolicy,
                            ])];
                }
            });
        });
    };
    Shield.prototype.getAssignedPolicies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addresses, assignments, _a, _b, _c, _i, address, _d, _e, _f, _g, sig, iface, func;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, (0, events_1.getPolicyAssigned)(this.contract, 0, 'latest')];
                    case 1:
                        addresses = _h.sent();
                        assignments = {};
                        _a = addresses;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _h.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3 /*break*/, 7];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 6];
                        address = _c;
                        assignments[address] = {};
                        _d = addresses[address];
                        _e = [];
                        for (_f in _d)
                            _e.push(_f);
                        _g = 0;
                        _h.label = 3;
                    case 3:
                        if (!(_g < _e.length)) return [3 /*break*/, 6];
                        _f = _e[_g];
                        if (!(_f in _d)) return [3 /*break*/, 5];
                        sig = _f;
                        return [4 /*yield*/, this.getInterface(address)];
                    case 4:
                        iface = _h.sent();
                        func = Utils.getFunction(sig, iface);
                        assignments[address][func] = addresses[address][sig];
                        _h.label = 5;
                    case 5:
                        _g++;
                        return [3 /*break*/, 3];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/, assignments];
                }
            });
        });
    };
    Shield.prototype.getAssignedPolicy = function (to, func) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, iface, sig, policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contract.getRoles()];
                    case 1:
                        roles = _a.sent();
                        return [4 /*yield*/, this.getInterface(to)];
                    case 2:
                        iface = _a.sent();
                        sig = Utils.getSignature(func, iface);
                        return [4 /*yield*/, this.contract.getAssignedPolicy(to, sig)];
                    case 3:
                        policy = _a.sent();
                        return [2 /*return*/, policy.map(function (bits) {
                                return Utils.getRolesFromBytes(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                            })];
                }
            });
        });
    };
    Shield.prototype.createCredentialsForAssignPolicy = function (to, func, label) {
        return __awaiter(this, void 0, void 0, function () {
            var shieldables, iface, sig, newLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShieldables()];
                    case 1:
                        shieldables = _a.sent();
                        if (to !== this.contract.address && shieldables.indexOf(to) === -1) {
                            throw new Error("".concat(to, " is not under that shield"));
                        }
                        return [4 /*yield*/, this.getInterface(to)];
                    case 2:
                        iface = _a.sent();
                        sig = Utils.getSignature(func, iface);
                        newLabel = ethers_1.ethers.utils.formatBytes32String(label);
                        return [2 /*return*/, this.createCredentials(this.contract.address, 'assignPolicy', [
                                to,
                                sig,
                                newLabel,
                            ])];
                }
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
    Shield.prototype.createCredentialsForPause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createCredentials(this.contract.address, 'pause', [])];
            });
        });
    };
    Shield.prototype.createCredentialsForUnpause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createCredentials(this.contract.address, 'unpause', [])];
            });
        });
    };
    Shield.prototype.createCredentialsForTransfer = function (to, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.createCredentials(this.contract.address, 'transfer', [
                        to,
                        amount,
                    ])];
            });
        });
    };
    Shield.prototype.canApprove = function (to, func, index) {
        return __awaiter(this, void 0, void 0, function () {
            var iface, sig, policy, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        index = typeof index === 'undefined' ? 0 : index;
                        return [4 /*yield*/, this.getInterface(to)];
                    case 1:
                        iface = _c.sent();
                        sig = Utils.getSignature(func, iface);
                        return [4 /*yield*/, this.contract.getAssignedPolicy(to, sig)];
                    case 2:
                        policy = _c.sent();
                        _b = (_a = this.contract).hasAnyRoles;
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent(), policy[index]])];
                }
            });
        });
    };
    Shield.prototype.getCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.getCredentials()];
            });
        });
    };
    Shield.prototype.checkCredentials = function (credentials, full) {
        return __awaiter(this, void 0, void 0, function () {
            var signer, sig, signers, iface, _a, func, args;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        full = typeof full === 'undefined' ? false : full;
                        return [4 /*yield*/, Utils.getSigner(['uint', 'uint', 'address', 'bytes'], [
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
                        return [4 /*yield*/, this.getInterface(credentials.to)];
                    case 3:
                        iface = _b.sent();
                        _a = Utils.decodeCallData(credentials.call, iface), func = _a.func, args = _a.args;
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
    Shield.prototype.createCredentials = function (to, func, args) {
        return __awaiter(this, void 0, void 0, function () {
            var chainid, timestamp, iface, call, signature, credentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canApprove(to, func)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error('Signer cannot create such credentials');
                        }
                        return [4 /*yield*/, this.signer.getChainId()];
                    case 2:
                        chainid = _a.sent();
                        timestamp = Math.floor(new Date().getTime());
                        return [4 /*yield*/, this.getInterface(to)];
                    case 3:
                        iface = _a.sent();
                        call = Utils.encodeCallData(func, args, iface);
                        return [4 /*yield*/, Utils.signData(this.signer, ['uint', 'uint', 'address', 'bytes'], [timestamp, chainid, to, call])];
                    case 4:
                        signature = _a.sent();
                        credentials = {
                            timestamp: timestamp,
                            chainid: chainid,
                            to: to,
                            call: call,
                            approvals: [signature],
                        };
                        return [4 /*yield*/, this.store.addCredentials(credentials)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, credentials];
                }
            });
        });
    };
    Shield.prototype.approveCredentials = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var iface, func, timestamp, chainid, to, call, approvals, lastSignature, signature, newCredentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInterface(credentials.to)];
                    case 1:
                        iface = _a.sent();
                        func = Utils.decodeCallData(credentials.call, iface).func;
                        return [4 /*yield*/, this.canApprove(credentials.to, func, credentials.approvals.length)];
                    case 2:
                        if (!(_a.sent())) {
                            throw new Error('Signer cannot approve the credentials');
                        }
                        timestamp = credentials.timestamp, chainid = credentials.chainid, to = credentials.to, call = credentials.call, approvals = credentials.approvals;
                        lastSignature = approvals[approvals.length - 1];
                        return [4 /*yield*/, Utils.signData(this.signer, ['bytes'], [lastSignature])];
                    case 3:
                        signature = _a.sent();
                        newCredentials = {
                            timestamp: timestamp,
                            chainid: chainid,
                            to: to,
                            call: call,
                            approvals: __spreadArray(__spreadArray([], approvals, true), [signature], false),
                        };
                        return [4 /*yield*/, this.store.addCredentials(newCredentials)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, newCredentials];
                }
            });
        });
    };
    Shield.prototype.executeCredentials = function (credentials, options) {
        return __awaiter(this, void 0, void 0, function () {
            var approvals, _a, _b, iface, contract, _c, func, args, tx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof options === 'undefined') {
                            options = {};
                        }
                        return [4 /*yield*/, this.checkCredentials(credentials, true)];
                    case 1:
                        approvals = (_d.sent()).approvals;
                        _b = (_a = approvals).indexOf;
                        return [4 /*yield*/, this.signer.getAddress()];
                    case 2:
                        if (_b.apply(_a, [_d.sent()]) == -1) {
                            throw new Error("signer is not one of the approvers");
                        }
                        return [4 /*yield*/, this.getInterface(credentials.to)];
                    case 3:
                        iface = _d.sent();
                        contract = new ethers_1.ethers.Contract(credentials.to, iface, this.signer);
                        _c = Utils.decodeCallData(credentials.call, iface), func = _c.func, args = _c.args;
                        return [4 /*yield*/, contract[func].apply(this, __spreadArray(__spreadArray([], args, true), [credentials], false), options)];
                    case 4:
                        tx = _d.sent();
                        return [4 /*yield*/, this.store.addTransaction(credentials, tx.hash)];
                    case 5:
                        _d.sent();
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    Shield.prototype.cancelCredentials = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contract.connect(this.signer).cancelCredentials(credentials)];
            });
        });
    };
    Shield.prototype.isCanceled = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var iface, contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInterface(credentials.to)];
                    case 1:
                        iface = _a.sent();
                        contract = new ethers_1.ethers.Contract(credentials.to, iface, this.signer);
                        return [2 /*return*/, contract.canceled(ethers_1.ethers.utils.keccak256(credentials.approvals[0]))];
                }
            });
        });
    };
    Shield.prototype.isExecuted = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var iface, contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInterface(credentials.to)];
                    case 1:
                        iface = _a.sent();
                        contract = new ethers_1.ethers.Contract(credentials.to, iface, this.signer);
                        return [2 /*return*/, contract.executed(ethers_1.ethers.utils.keccak256(credentials.approvals[0]))];
                }
            });
        });
    };
    Shield.prototype.getTransactionHash = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isExecuted(credentials)) {
                    throw new Error("credentials have not been executed");
                }
                return [2 /*return*/, this.store.getTransaction(credentials)];
            });
        });
    };
    return Shield;
}());
exports.Shield = Shield;
