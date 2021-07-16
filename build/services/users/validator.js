"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidator = exports.UserValidator = void 0;
var express_validator_1 = require("express-validator");
exports.UserValidator = [
    express_validator_1.body("firstname").exists().withMessage("Firstname is a mandatory field"),
    express_validator_1.body("surname").exists().withMessage("Surname is a mandatory field"),
    express_validator_1.body("email").exists().isLength({ max: 50 }).withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email"),
    express_validator_1.body("password").exists().isLength({ min: 8, max: 128 }).withMessage("Password is a mandatory field and needs to be at least 8 character")
];
exports.LoginValidator = [
    express_validator_1.body("email").exists().withMessage("Email is a mandatory field").isEmail().normalizeEmail().withMessage("Invalid email"),
    express_validator_1.body("password").exists().withMessage("Password is a mandatory field")
];
