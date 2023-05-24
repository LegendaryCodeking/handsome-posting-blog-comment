"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAuthorizationCheck = exports.authorizationCheck = void 0;
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.authorizationCheck = authorizationCheck;
const superAuthorizationCheck = (req, res, next) => {
    // login:"Super Admin";
    // pass: "qwerty12345"
    if (req.headers["authorization"] !== "Basic U3VwZXIgQWRtaW46cXdlcnR5MTIzNDU=") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.superAuthorizationCheck = superAuthorizationCheck;
