"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAllHandler = exports.forbiddenHandler = exports.unAuthorizedHandler = exports.error400 = void 0;
var error400 = function (err, req, res, next) {
    if (err.status === 400)
        res.status(400).send(err);
    else
        next(err);
};
exports.error400 = error400;
var unAuthorizedHandler = function (err, req, res, next) {
    if (err.status === 401)
        res.status(401).send(err.message || "You are not logged in!");
    else
        next(err);
};
exports.unAuthorizedHandler = unAuthorizedHandler;
var forbiddenHandler = function (err, req, res, next) {
    if (err.status === 403)
        res.status(403).send(err.message || "You are not allowed to do that!");
    else
        next(err);
};
exports.forbiddenHandler = forbiddenHandler;
var catchAllHandler = function (err, req, res, next) {
    res.status(500).send(err.message);
};
exports.catchAllHandler = catchAllHandler;
