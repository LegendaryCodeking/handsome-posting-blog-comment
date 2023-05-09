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
exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../index");
const blogs_router_1 = require("./blogs-router");
const posts_repo_1 = require("../repos/posts-repo");
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
const titleValidation = (0, express_validator_1.body)("title").isString().withMessage("Title should be string").trim().isLength({
    min: 1,
    max: 15
}).withMessage("The length should be from 1 to 15 symbols");
const shortDescription = (0, express_validator_1.body)("shortDescription").isString().withMessage("shortDescription should be string").trim().isLength({
    min: 1,
    max: 100
}).withMessage("The length should be from 1 to 100 symbols");
const content = (0, express_validator_1.body)("content").isString().withMessage("content should be string").trim().isLength({
    min: 1,
    max: 1000
}).withMessage("The length should be from 1 to 1000 symbols");
const blogId = (0, express_validator_1.body)('blogId').isString().withMessage("blogId should be string").trim().isLength({ min: 1 }).withMessage("The length should be > 0").custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_router_1.db_blogs.blogs.find(c => +c.id === +value);
    if (!foundBlog) {
        throw new Error('There is no blog with such ID');
    }
}));
const inputValidationMw = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(index_1.STATUSES_HTTP.BAD_REQUEST_400)
            .json({
            errorsMessages: result.array({ onlyFirstError: true }).map(val => ({
                "message": val.msg,
                //@ts-ignore
                "field": val["path"]
            }))
        });
    }
    else {
        next();
    }
};
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    let foundPosts = posts_repo_1.postsRepo.findPosts();
    if (!foundPosts.length) {
        res.status(index_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(index_1.STATUSES_HTTP.OK_200)
        .json(foundPosts);
});
exports.postsRouter.get('/:id', (req, res) => {
    const foundPost = posts_repo_1.postsRepo.findProductById(req.body.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundPost);
});
exports.postsRouter.delete('/:id', authorizationCheck, (req, res) => {
    const deletionStatus = posts_repo_1.postsRepo.deletePost(req.body.id);
    if (deletionStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
exports.postsRouter.post('/', authorizationCheck, titleValidation, shortDescription, content, blogId, inputValidationMw, (req, res) => {
    let createdPost = posts_repo_1.postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
exports.postsRouter.put('/:id', authorizationCheck, titleValidation, shortDescription, content, blogId, inputValidationMw, (req, res) => {
    let updateStatus = posts_repo_1.postsRepo.updatePost(req.body.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (updateStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
