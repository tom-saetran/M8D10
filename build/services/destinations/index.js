"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var isValidObjectId = mongoose_1.default.isValidObjectId;
var schema_1 = __importDefault(require("./schema"));
var http_errors_1 = __importDefault(require("http-errors"));
var console_1 = __importDefault(require("console"));
var middlewares_1 = require("../../auth/middlewares");
var admin_1 = require("../../auth/admin");
var validator_1 = require("./validator");
var express_validator_1 = require("express-validator");
var destinationsRouter = express_1.default.Router();
destinationsRouter.get("/", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, schema_1.default.find()];
            case 1:
                response = _a.sent();
                res.send(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(http_errors_1.default(500, error_1));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
destinationsRouter.post("/", validator_1.LocationValidator, middlewares_1.JWTAuthMiddleware, admin_1.checkIfAdmin, admin_1.checkIfHost, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) return [3 /*break*/, 2];
                result = new schema_1.default(req.body);
                console_1.default.log(result);
                return [4 /*yield*/, result.save()];
            case 1:
                if (_a.sent())
                    res.status(201).send(result);
                else
                    next(http_errors_1.default(400, "Error saving data!"));
                return [3 /*break*/, 3];
            case 2:
                next(http_errors_1.default(400, errors.mapped()));
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                next(http_errors_1.default(400, error_2));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
destinationsRouter.get("/:id", middlewares_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                result = void 0;
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findById(req.params.id)];
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
                error_3 = _a.sent();
                console_1.default.log(error_3);
                next(error_3.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
destinationsRouter.put("/:id", middlewares_1.JWTAuthMiddleware, admin_1.checkIfAdmin, admin_1.checkIfHost, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                result = void 0;
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findByIdAndUpdate(req.params.id, __assign(__assign({}, req.body), { updatedAt: new Date() }), { runValidators: true, new: true, useFindAndModify: false })];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3:
                if (result)
                    res.status(200).send(result);
                else
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
destinationsRouter.delete("/:id", middlewares_1.JWTAuthMiddleware, admin_1.checkIfAdmin, admin_1.checkIfHost, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                result = void 0;
                if (!!isValidObjectId(req.params.id)) return [3 /*break*/, 1];
                next(http_errors_1.default(400, "ID " + req.params.id + " is invalid"));
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, schema_1.default.findByIdAndDelete(req.params.id)];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3:
                if (result)
                    res.status(204).send("Deleted");
                else
                    next(http_errors_1.default(404, "ID " + req.params.id + " was not found"));
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = destinationsRouter;
