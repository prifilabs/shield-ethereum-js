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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicyAssigned = exports.getPolicyAdded = exports.getUsersSet = exports.getRolesAdded = exports.getShieldCreated = void 0;
var ethers_1 = require("ethers");
var utils_1 = require("./utils");
function getShieldCreated(factory, first, last) {
    return __awaiter(this, void 0, void 0, function () {
        var events, shields, _i, events_1, event_1, _a, _, addr, name_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, factory.queryFilter('ShieldCreated', first, last)];
                case 1:
                    events = _b.sent();
                    shields = {};
                    for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                        event_1 = events_1[_i];
                        _a = event_1.args, _ = _a[0], addr = _a[1], name_1 = _a[2];
                        shields[addr] = ethers_1.ethers.utils.parseBytes32String(name_1);
                    }
                    return [2 /*return*/, shields];
            }
        });
    });
}
exports.getShieldCreated = getShieldCreated;
function getRolesAdded(shield, first, last) {
    return __awaiter(this, void 0, void 0, function () {
        var events, roles, _i, events_2, event_2, l;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, shield.queryFilter('RolesAdded', first, last)];
                case 1:
                    events = _a.sent();
                    roles = [];
                    for (_i = 0, events_2 = events; _i < events_2.length; _i++) {
                        event_2 = events_2[_i];
                        l = event_2.args[0];
                        roles = roles.concat(l);
                    }
                    return [2 /*return*/, roles];
            }
        });
    });
}
exports.getRolesAdded = getRolesAdded;
function getUsersSet(shield, first, last, roles) {
    return __awaiter(this, void 0, void 0, function () {
        var events, users, _i, events_3, event_3, _users, _a, _users_1, user, addr, bits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, shield.queryFilter('UsersSet', first, last)];
                case 1:
                    events = _b.sent();
                    users = {};
                    for (_i = 0, events_3 = events; _i < events_3.length; _i++) {
                        event_3 = events_3[_i];
                        _users = event_3.args[0];
                        for (_a = 0, _users_1 = _users; _a < _users_1.length; _a++) {
                            user = _users_1[_a];
                            addr = user[0], bits = user[1];
                            users[addr] = (0, utils_1.getRolesFromBytes)(bits, roles).map(ethers_1.ethers.utils.parseBytes32String);
                        }
                    }
                    return [2 /*return*/, users];
            }
        });
    });
}
exports.getUsersSet = getUsersSet;
function getPolicyAdded(shield, first, last, roles) {
    return __awaiter(this, void 0, void 0, function () {
        var events, policies, _i, events_4, event_4, _a, label, policy, decodedLabel, decodedPolicy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, shield.queryFilter('PolicyAdded', first, last)];
                case 1:
                    events = _b.sent();
                    policies = {};
                    for (_i = 0, events_4 = events; _i < events_4.length; _i++) {
                        event_4 = events_4[_i];
                        _a = event_4.args, label = _a[0], policy = _a[1];
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
}
exports.getPolicyAdded = getPolicyAdded;
function getPolicyAssigned(shield, first, last) {
    return __awaiter(this, void 0, void 0, function () {
        var events, assignments, _i, events_5, event_5, _a, to, sig, label, decodedLabel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, shield.queryFilter('PolicyAssigned', first, last)];
                case 1:
                    events = _b.sent();
                    assignments = {};
                    for (_i = 0, events_5 = events; _i < events_5.length; _i++) {
                        event_5 = events_5[_i];
                        _a = event_5.args, to = _a[0], sig = _a[1], label = _a[2];
                        if (!(to in assignments)) {
                            assignments[to] = {};
                        }
                        decodedLabel = ethers_1.ethers.utils.parseBytes32String(label);
                        assignments[to][sig] = decodedLabel;
                    }
                    return [2 /*return*/, assignments];
            }
        });
    });
}
exports.getPolicyAssigned = getPolicyAssigned;
