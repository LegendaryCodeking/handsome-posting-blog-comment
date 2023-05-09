"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../index");
const blogs_repo_1 = require("../repos/blogs-repo");
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
const nameValidation = (0, express_validator_1.body)("name").trim().isLength({
    min: 1,
    max: 15
}).isString().withMessage(`Name length should be from 1 to 15 symbols`);
const descriptionValidation = (0, express_validator_1.body)("description").isString().isLength({
    min: 1,
    max: 500
}).withMessage(`Description should be string type`);
const urlValidation = (0, express_validator_1.body)("websiteUrl").isURL({ protocols: ['https'] }).isString().isLength({
    min: 1,
    max: 100
}).withMessage("websiteUrl should be correct");
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
exports.blogsRouter.delete('/:id', authorizationCheck, (req, res) => {
    let deleteStatus = blogs_repo_1.blogsRepo.deleteBlog(req.body.id);
    if (deleteStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
exports.blogsRouter.post('/', authorizationCheck, nameValidation, descriptionValidation, urlValidation, inputValidationMw, (req, res) => {
    let createdBlog = blogs_repo_1.blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdBlog);
});
exports.blogsRouter.put('/:id', authorizationCheck, nameValidation, descriptionValidation, urlValidation, inputValidationMw, (req, res) => {
    let updateStatus = blogs_repo_1.blogsRepo.updateBlog(req.body.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (updateStatus) {
        res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
    }
});
