"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogId = exports.content = exports.shortDescription = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_repo_1 = require("../repos/blogs-repo");
exports.titleValidation = (0, express_validator_1.body)("title")
    .isString().withMessage("Title should be string")
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage("The length should be from 1 to 15 symbols");
exports.shortDescription = (0, express_validator_1.body)("shortDescription")
    .isString().withMessage("shortDescription should be string")
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage("The length should be from 1 to 100 symbols");
exports.content = (0, express_validator_1.body)("content")
    .isString().withMessage("content should be string")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("The length should be from 1 to 1000 symbols");
exports.blogId = (0, express_validator_1.body)('blogId')
    .isString().withMessage("blogId should be string")
    .trim().isLength({ min: 1, max: 100 }).withMessage("The length should be > 0")
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_repo_1.blogsRepo.findBlogById(value);
    if (!foundBlog) {
        throw new Error('There is no blog with such ID');
    }
}));
