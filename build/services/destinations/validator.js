"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidator = void 0;
var express_validator_1 = require("express-validator");
exports.LocationValidator = [express_validator_1.body("city").exists().withMessage("City is a mandatory field")];
