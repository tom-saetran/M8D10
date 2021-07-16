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
        while (_) try {
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
var query_to_mongo_1 = __importDefault(require("query-to-mongo"));
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var schema_1 = __importDefault(require("./schema"));
var http_errors_1 = __importDefault(require("http-errors"));
var express_validator_1 = require("express-validator");
var mongoose_1 = __importDefault(require("mongoose"));
var isValidObjectId = mongoose_1.default.isValidObjectId;
var middlewares_1 = require("../../auth/middlewares");
var admin_1 = require("../../auth/admin");
var validator_1 = require("./validator");
var tools_1 = require("../../auth/tools");
var usersRouter = express_1.default.Router();
usersRouter.post("/register", validator_1.UserValidator, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, entry, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) return [3 /*break*/, 2];
                entry = new schema_1.default(req.body);
                return [4 /*yield*/, entry.save()];
            case 1:
                result = _a.sent();
                res.status(201).send({ id: result._id, role: result.role });
                return [3 /*break*/, 3];
            case 2:
                next(http_errors_1.default(400, errors.mapped()));
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
usersRouter.post("/login", validator_1.LoginValidator, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, email, password, tokens, user, _b, accessToken, refreshToken, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) return [3 /*break*/, 5];
                _a = req.body, email = _a.email, password = _a.password;
                tokens = req.user;
                return [4 /*yield*/, schema_1.default.checkCredentials(email, password)];
            case 1:
                user = _c.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, tools_1.JWTAuthenticate(user)];
            case 2:
                _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                res.cookie("accessToken", tokens.accessToken, { httpOnly: true /*sameSite: "lax", secure: true*/ });
                res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true /*sameSite: "lax", secure: true*/ });
                res.status(200).redirect("http://localhost:666/");
                return [3 /*break*/, 4];
            case 3:
                next(http_errors_1.default(401, "Wrong credentials provided"));
                _c.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                next(http_errors_1.default(400, errors.mapped()));
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
usersRouter.get("/login/oauth/google/login", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
usersRouter.get("/login/oauth/google/redirect", passport_1.default.authenticate("google"), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens;
    return __generator(this, function (_a) {
        try {
            tokens = req.user;
            res.cookie("accessToken", tokens.accessToken, { httpOnly: true /*sameSite: "lax", secure: true*/ });
            res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true /*sameSite: "lax", secure: true*/ });
            res.status(200).redirect("http://localhost:666/");
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
usersRouter.post("/logout", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                user.refreshToken = undefined;
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                res.status(205).send("Logged out");
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
usersRouter.post("/refreshToken", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, newAccessToken, newRefreshToken, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!!req.body.refreshToken) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "Refresh Token not provided"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, tools_1.refreshTokens(req.body.refreshToken)];
            case 2:
                _a = _b.sent(), newAccessToken = _a.newAccessToken, newRefreshToken = _a.newRefreshToken;
                res.send({ newAccessToken: newAccessToken, newRefreshToken: newRefreshToken });
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
usersRouter.get("/", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, total, limit, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                query = query_to_mongo_1.default(req.query);
                return [4 /*yield*/, schema_1.default.countDocuments(query.criteria)];
            case 1:
                total = _a.sent();
                limit = 25;
                return [4 /*yield*/, schema_1.default.find(query.criteria)
                        .sort(query.options.sort)
                        .skip(query.options.skip || 0)
                        .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)];
            case 2:
                result = _a.sent();
                res.status(200).send({ links: query.links("/users", total), total: total, result: result });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
usersRouter.get("/me", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.send(req.user);
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
usersRouter.get("/me/accommodations", middlewares_1.JWTAuthMiddleware, admin_1.checkIfHost, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, schema_1.default.findById(user._id).populate("accommodations")];
            case 1:
                result = _a.sent();
                res.status(200).send(result.accommodations);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
usersRouter.delete("/me", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, user.deleteOne()];
            case 1:
                _a.sent();
                res.status(205).send("User terminated");
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
usersRouter.put("/me", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                req.body.name ? (user.firstname = req.body.name) : null;
                req.body.surname ? (user.surname = req.body.surname) : null;
                req.body.email ? (user.email = req.body.email) : null;
                return [4 /*yield*/, user.save()];
            case 1:
                result = _a.sent();
                res.status(200).send(result);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
usersRouter.get("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findById(req.params.id)];
            case 2:
                result = _a.sent();
                if (!result)
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                else
                    res.status(200).send(result);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
usersRouter.get("/:id/accommodations", middlewares_1.JWTAuthMiddleware, admin_1.checkIfHost, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findById(req.params.id).populate("accommodations")];
            case 2:
                result = _a.sent();
                if (!result)
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                else
                    res.status(200).send(result.accommodations);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_10 = _a.sent();
                next(error_10);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
usersRouter.delete("/:id", middlewares_1.JWTAuthMiddleware, admin_1.checkUserEditPrivileges, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                result = void 0;
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findByIdAndDelete(req.params.id, { useFindAndModify: false })];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3:
                if (result)
                    res.status(200).send("User Terminated");
                else
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                next(error_11);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
usersRouter.put("/:id", middlewares_1.JWTAuthMiddleware, admin_1.checkUserEditPrivileges, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                result = void 0;
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true, useFindAndModify: false })];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3:
                if (!result)
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                else
                    res.status(200).send(result);
                return [3 /*break*/, 5];
            case 4:
                error_12 = _a.sent();
                next(error_12);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = usersRouter;
