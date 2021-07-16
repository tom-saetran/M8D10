"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
var users_1 = __importDefault(require("./services/users"));
var accomodations_1 = __importDefault(require("./services/accomodations"));
var destinations_1 = __importDefault(require("./services/destinations"));
var errorHandlers_1 = require("./errorHandlers");
var server = express_1.default();
var port = process.env.PORT || 3001;
// MIDDLEWARES
server.use(cors_1.default({ origin: "localhost", credentials: true }));
server.use(express_1.default.json());
server.use(cookie_parser_1.default());
server.use(passport_1.default.initialize());
// ROUTES
server.use("/users", users_1.default);
server.use("/accommodations", accomodations_1.default);
server.use("/destinations", destinations_1.default);
// ERROR HANDLERS
server.use(errorHandlers_1.error400);
server.use(errorHandlers_1.unAuthorizedHandler);
server.use(errorHandlers_1.forbiddenHandler);
server.use(errorHandlers_1.catchAllHandler);
console.table(express_list_endpoints_1.default(server));
exports.default = server;
