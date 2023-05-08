"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = exports.db_blogs = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../index");
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
            //@ts-ignore
            .json({ errorsMessages: result.array().map(val => ({ "message": val.msg, "field": val["path"] })) });
    }
    else {
        next();
    }
};
exports.db_blogs = {
    blogs: [
        {
            "id": "1",
            "name": "Marieh Kondo",
            "description": "Bingo article about Marieh Kondo and his famous book",
            "websiteUrl": "https://telegra.ph/Marieh-Kondo-02-14"
        },
        {
            "id": "2",
            "name": "Meandr",
            "description": "Bingo article about Meandr",
            "websiteUrl": "https://telegra.ph/Meandr-02-14"
        },
        {
            "id": "3",
            "name": "Dzhiro dItaliya",
            "description": "Bingo article about famous italian bicycle race Dzhiro dItaliya",
            "websiteUrl": "https://telegra.ph/Dzhiro-dItaliya-02-13"
        }
    ]
};
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    let foundBlogs = exports.db_blogs.blogs;
    if (!foundBlogs.length) {
        res.status(index_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(index_1.STATUSES_HTTP.OK_200)
        .json(foundBlogs);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const foundBlog = exports.db_blogs.blogs.find(c => +c.id === +req.params.id);
    if (!foundBlog) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundBlog);
});
exports.blogsRouter.delete('/:id', authorizationCheck, (req, res) => {
    const foundBlog = exports.db_blogs.blogs.find(c => +c.id === +req.params.id);
    if (!foundBlog) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    exports.db_blogs.blogs = exports.db_blogs.blogs.filter(c => +c.id !== +req.params.id);
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
exports.blogsRouter.post('/', authorizationCheck, nameValidation, descriptionValidation, urlValidation, inputValidationMw, (req, res) => {
    const createdPost = {
        "id": (+(new Date())).toString(),
        "name": req.body.name,
        "description": req.body.description,
        "websiteUrl": req.body.websiteUrl
    };
    exports.db_blogs.blogs.push(createdPost);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
exports.blogsRouter.put('/:id', authorizationCheck, nameValidation, descriptionValidation, urlValidation, inputValidationMw, (req, res) => {
    const foundBlog = exports.db_blogs.blogs.find(c => +c.id === +req.params.id);
    if (!foundBlog) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    foundBlog.name = req.body.name;
    foundBlog.description = req.body.description;
    foundBlog.websiteUrl = req.body.websiteUrl;
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
