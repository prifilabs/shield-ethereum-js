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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStore = exports.MemoryStore = exports.getServerStore = exports.getMemoryStore = void 0;
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var ethers_1 = require("ethers");
var Utils = __importStar(require("./utils"));
var getMemoryStore = function (network, shield) {
    return new MemoryStore(network, shield);
};
exports.getMemoryStore = getMemoryStore;
var getServerStore = function (network, shield) {
    return new ServerStore(network, shield);
};
exports.getServerStore = getServerStore;
var MemoryStore = /** @class */ (function () {
    function MemoryStore(network, shield) {
        this.key = shield + '@' + network;
        if (!(this.key in MemoryStore.shields)) {
            MemoryStore.shields[this.key] = {
                interfaces: {},
                credentials: {},
                transactions: {},
            };
        }
    }
    MemoryStore.prototype.addInterface = function (address, iface) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                MemoryStore.shields[this.key].interfaces[address] = iface;
                return [2 /*return*/];
            });
        });
    };
    MemoryStore.prototype.getInterface = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!(address in MemoryStore.shields[this.key].interfaces)) {
                    throw new Error("no interface for ".concat(address));
                }
                return [2 /*return*/, MemoryStore.shields[this.key].interfaces[address]];
            });
        });
    };
    MemoryStore.prototype.addCredentials = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                MemoryStore.shields[this.key].credentials[credentials.approvals[0]] =
                    credentials;
                return [2 /*return*/];
            });
        });
    };
    MemoryStore.prototype.getCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Object.values(MemoryStore.shields[this.key].credentials)];
            });
        });
    };
    MemoryStore.prototype.addTransaction = function (credentials, hash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                MemoryStore.shields[this.key].transactions[credentials.approvals[0]] =
                    hash;
                return [2 /*return*/];
            });
        });
    };
    MemoryStore.prototype.getTransaction = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, MemoryStore.shields[this.key].transactions[credentials.approvals[0]]];
            });
        });
    };
    MemoryStore.shields = {};
    return MemoryStore;
}());
exports.MemoryStore = MemoryStore;
var ServerStore = /** @class */ (function () {
    function ServerStore(network, shield) {
        this.url = "".concat(ServerStore.server, "/").concat(network, "/").concat(shield);
        this.shieldablesCache = {};
        this.transactionCache = {};
    }
    ServerStore.setServer = function (server) {
        ServerStore.server = server;
    };
    ServerStore.prototype.addInterface = function (address, iface) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/interfaces/").concat(address, "/"), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                interface: iface.format(ethers_1.ethers.utils.FormatTypes.full),
                            }),
                        })];
                    case 1:
                        _a.sent();
                        this.shieldablesCache[address] = iface;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerStore.prototype.getInterface = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, iface;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (address in this.shieldablesCache) {
                            return [2 /*return*/, this.shieldablesCache[address]];
                        }
                        return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/interfaces/").concat(address, "/"))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        iface = new ethers_1.ethers.utils.Interface(data.interface);
                        this.shieldablesCache[address] = iface;
                        return [2 /*return*/, iface];
                }
            });
        });
    };
    ServerStore.prototype.addCredentials = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/credentials/"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                credentials: Utils.encodeCredentials(credentials),
                            }),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerStore.prototype.getCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/credentials/"))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data.map(function (credentials) {
                                return Utils.decodeCredentials(credentials);
                            })];
                }
            });
        });
    };
    ServerStore.prototype.addTransaction = function (credentials, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var approver;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        approver = btoa(credentials.approvals[0]);
                        return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/credentials/").concat(approver, "/"), {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tx: hash,
                                }),
                            })];
                    case 1:
                        _a.sent();
                        this.transactionCache[approver] = hash;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerStore.prototype.getTransaction = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var approver, response, data, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        approver = btoa(credentials.approvals[0]);
                        if (approver in this.transactionCache) {
                            return [2 /*return*/, this.transactionCache[approver]];
                        }
                        return [4 /*yield*/, (0, cross_fetch_1.default)("".concat(this.url, "/credentials/").concat(approver, "/"))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        tx = data.tx;
                        this.transactionCache[approver] = tx;
                        return [2 /*return*/, tx];
                }
            });
        });
    };
    ServerStore.server = 'https://shield-backend.prifilabs.com';
    return ServerStore;
}());
exports.ServerStore = ServerStore;
