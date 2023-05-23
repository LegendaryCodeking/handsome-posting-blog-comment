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
const posts_service_1 = require("../domain/posts-service");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const post_validation_mw_1 = require("../middlewares/post-validation-mw");
const http_statuses_const_1 = require("./http-statuses-const");
const BlogsFilterModel_1 = require("../models/BlogsFilterModel");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryFilter = (0, BlogsFilterModel_1.queryPagination)(req);
    let foundPosts = yield posts_service_1.postsService.findPosts(queryFilter);
    if (!foundPosts.items.length) {
        res.status(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(http_statuses_const_1.STATUSES_HTTP.OK_200)
        .json(foundPosts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_service_1.postsService.findProductById(req.params.id);
    if (!foundPost) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundPost);
}));
exports.postsRouter.delete('/:id', authorization_mw_1.authorizationCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletionStatus = yield posts_service_1.postsService.deletePost(req.params.id);
    if (deletionStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
exports.postsRouter.post('/', authorization_mw_1.authorizationCheck, post_validation_mw_1.titleValidation, post_validation_mw_1.shortDescription, post_validation_mw_1.content, post_validation_mw_1.blogId, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let createdPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(http_statuses_const_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
}));
exports.postsRouter.put('/:id', authorization_mw_1.authorizationCheck, post_validation_mw_1.titleValidation, post_validation_mw_1.shortDescription, post_validation_mw_1.content, post_validation_mw_1.blogId, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updateStatus = yield posts_service_1.postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (updateStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
