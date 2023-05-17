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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repo_1 = require("../repos/blogs-repo");
const blog_validation_mw_1 = require("../middlewares/blog-validation-mw");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
const http_statuses_const_1 = require("./http-statuses-const");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundBlogs = yield blogs_repo_1.blogsRepo.findBlogs();
    if (!foundBlogs.length) {
        res.status(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(http_statuses_const_1.STATUSES_HTTP.OK_200)
        .json(foundBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_repo_1.blogsRepo.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundBlog);
}));
exports.blogsRouter.delete('/:id', authorization_mw_1.authorizationCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteStatus = yield blogs_repo_1.blogsRepo.deleteBlog(req.params.id);
    if (deleteStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
exports.blogsRouter.post('/', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let createdBlog = yield blogs_repo_1.blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(http_statuses_const_1.STATUSES_HTTP.CREATED_201)
        .json(createdBlog);
}));
exports.blogsRouter.put('/:id', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => {
    let updateStatus = blogs_repo_1.blogsRepo.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (updateStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
