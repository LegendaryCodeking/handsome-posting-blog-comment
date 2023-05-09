"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const posts_repo_1 = require("../repos/posts-repo");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const post_validation_mw_1 = require("../middlewares/post-validation-mw");
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
    const foundPost = posts_repo_1.postsRepo.findProductById(req.params.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundPost);
});
exports.postsRouter.delete('/:id', authorization_mw_1.authorizationCheck, (req, res) => {
    const deletionStatus = posts_repo_1.postsRepo.deletePost(req.params.id);
    if (deletionStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
exports.postsRouter.post('/', authorization_mw_1.authorizationCheck, post_validation_mw_1.titleValidation, post_validation_mw_1.shortDescription, post_validation_mw_1.content, post_validation_mw_1.blogId, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => {
    let createdPost = posts_repo_1.postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
exports.postsRouter.put('/:id', authorization_mw_1.authorizationCheck, post_validation_mw_1.titleValidation, post_validation_mw_1.shortDescription, post_validation_mw_1.content, post_validation_mw_1.blogId, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => {
    let updateStatus = posts_repo_1.postsRepo.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (updateStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
