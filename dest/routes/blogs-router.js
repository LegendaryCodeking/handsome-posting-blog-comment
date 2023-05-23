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
const blogs_service_1 = require("../domain/blogs-service");
const blog_validation_mw_1 = require("../middlewares/blog-validation-mw");
const authorization_mw_1 = require("../middlewares/authorization-mw");
const inputErrorsCheck_mw_1 = require("../middlewares/inputErrorsCheck-mw");
const http_statuses_const_1 = require("./http-statuses-const");
const posts_service_1 = require("../domain/posts-service");
const post_validation_mw_1 = require("../middlewares/post-validation-mw");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let queryFilter = {
        searchNameTerm: ((_a = req.query.searchNameTerm) === null || _a === void 0 ? void 0 : _a.toString()) || null,
        sortBy: ((_b = req.query.sortBy) === null || _b === void 0 ? void 0 : _b.toString()) || "createdAt",
        sortDirection: (_c = (req.query.sortDirection === 'asc' ? 'asc' : undefined)) !== null && _c !== void 0 ? _c : 'desc',
        pageNumber: +((_d = req.query.pageNumber) !== null && _d !== void 0 ? _d : 1),
        pageSize: +((_e = req.query.pageSize) !== null && _e !== void 0 ? _e : 10)
    };
    let foundBlogs = yield blogs_service_1.blogsService.findBlogs(queryFilter);
    if (!foundBlogs.length) {
        res.status(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(http_statuses_const_1.STATUSES_HTTP.OK_200)
        .json(foundBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundBlog);
}));
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j;
    const foundBlog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    // Copy from posts-router
    let queryFilter = {
        sortBy: ((_f = req.query.sortBy) === null || _f === void 0 ? void 0 : _f.toString()) || "createdAt",
        sortDirection: (_g = (req.query.sortDirection === 'asc' ? 'asc' : undefined)) !== null && _g !== void 0 ? _g : 'desc',
        pageNumber: +((_h = req.query.pageNumber) !== null && _h !== void 0 ? _h : 1),
        pageSize: +((_j = req.query.pageSize) !== null && _j !== void 0 ? _j : 10),
        blogId: req.params.id.toString()
    };
    let foundPosts = yield posts_service_1.postsService.findPosts(queryFilter);
    if (!foundPosts.items.length) {
        res.status(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(http_statuses_const_1.STATUSES_HTTP.OK_200)
        .json(foundPosts);
}));
exports.blogsRouter.delete('/:id', authorization_mw_1.authorizationCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteStatus = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
    if (deleteStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
exports.blogsRouter.post('/', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let createdBlog = yield blogs_service_1.blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(http_statuses_const_1.STATUSES_HTTP.CREATED_201)
        .json(createdBlog);
}));
exports.blogsRouter.post('/:id/posts', authorization_mw_1.authorizationCheck, post_validation_mw_1.titleValidation, post_validation_mw_1.shortDescription, post_validation_mw_1.content, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    let createdPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id.toString());
    res.status(http_statuses_const_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
}));
exports.blogsRouter.put('/:id', authorization_mw_1.authorizationCheck, blog_validation_mw_1.nameValidation, blog_validation_mw_1.descriptionValidation, blog_validation_mw_1.urlValidation, inputErrorsCheck_mw_1.inputValidationMw, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let updateStatus = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (updateStatus) {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NOT_FOUND_404);
    }
}));
