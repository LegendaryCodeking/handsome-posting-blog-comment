"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = exports.loginValidation = exports.passwordValidation = void 0;
const express_validator_1 = require("express-validator");
exports.passwordValidation = (0, express_validator_1.body)("name")
    .isString().withMessage(`Pass should be string`)
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage(`Pass length should be from 6 to 20 symbols`);
exports.loginValidation = (0, express_validator_1.body)("name")
    .isString().withMessage(`login should be string`)
    .trim()
    .isLength({ min: 3, max: 10 }).withMessage(`login length should be from 3 to 10 symbols`)
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage(`ERROR login contains inappropriate symbols`);
exports.emailValidation = (0, express_validator_1.body)("email")
    .isString().withMessage(`Email should be string`)
    .trim()
    .isLength({ min: 5, max: 50 }).withMessage(`Email length should be from 5 to 50 symbols`)
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage(`ERROR email contains inappropriate symbols`);
