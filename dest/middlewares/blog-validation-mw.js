"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlValidation = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)("name")
    .isString().withMessage(`Name should be string`)
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage(`name length should be from 1 to 15 symbols`);
exports.descriptionValidation = (0, express_validator_1.body)("description")
    .isString().withMessage(`description should be string type`)
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage(`description length should be from 1 to 500 symbols`);
exports.urlValidation = (0, express_validator_1.body)("websiteUrl")
    .isString().withMessage(`websiteUrl should be string type`)
    .isURL({ protocols: ['https'] }).withMessage(`websiteUrl should be correct URL`)
    .isLength({ min: 1, max: 100 }).withMessage(`websiteUrl length should be from 1 to 100 symbols`);
