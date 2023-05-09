"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationCheck = void 0;
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.authorizationCheck = authorizationCheck;
