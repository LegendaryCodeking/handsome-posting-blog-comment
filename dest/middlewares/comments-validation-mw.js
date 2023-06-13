"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.contentValidation = (0, express_validator_1.body)("content")
    .isString().withMessage(`Content field should be string type`)
    .trim()
    .isLength({ min: 20, max: 300 }).withMessage(`Comment's length should be from 20 to 300 symbols`);
