"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const blogs_repo_1 = require("../repos/blogs-repo");
const blog_validation_mw_1 = require("../middlewares/blog-validation-mw");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    let foundBlogs = blogs_repo_1.blogsRepo.findBlogs();
    if (!foundBlogs.length) {
        res.status(index_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(index_1.STATUSES_HTTP.OK_200)
        .json(foundBlogs);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const foundBlog = blogs_repo_1.blogsRepo.findBlogById(req.body.id);
    if (!foundBlog) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundBlog);
});
exports.blogsRouter.delete('/:id', authorization_mw_1.authorizationCheck, (req, res) => {
    let deleteStatus = blogs_repo_1.blogsRepo.deleteBlog(req.body.id);
    if (deleteStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
exports.blogsRouter.post('/', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => {
    let createdBlog = blogs_repo_1.blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdBlog);
});
exports.blogsRouter.put('/:id', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => {
    let updateStatus = blogs_repo_1.blogsRepo.updateBlog(req.body.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (updateStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
