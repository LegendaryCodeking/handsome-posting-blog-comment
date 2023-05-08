"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = exports.db_posts = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const index_1 = require("../index");
const blogs_router_1 = require("./blogs-router");
exports.db_posts = {
    posts: [
        {
            "id": "1",
            "title": "Very interesting story number 111111111",
            "shortDescription": "Very interesting story number 111111111 short desc",
            "content": "Very interesting story number 111111111 outstanding content",
            "blogId": "111111111",
            "blogName": "BingoBlog"
        },
        {
            "id": "2",
            "title": "Very interesting story number 222222",
            "shortDescription": "Very interesting story number 222222 short desc",
            "content": "Very interesting story number 222222 outstanding content",
            "blogId": "222222",
            "blogName": "ShlakoBlocun"
        },
        {
            "id": "3",
            "title": "Very interesting story number 3333333333",
            "shortDescription": "Very interesting story number 3333333333 short desc",
            "content": "Very interesting story number 3333333333 outstanding content",
            "blogId": "3333333333",
            "blogName": "DogMemes"
        }
    ]
};
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
const titleValidation = (0, express_validator_1.body)("title").isString().withMessage("Title should be string").trim().isLength({ min: 1, max: 15 }).withMessage("The length should be from 1 to 15 symbols");
const shortDescription = (0, express_validator_1.body)("shortDescription").isString().withMessage("shortDescription should be string").trim().isLength({ min: 1, max: 100 }).withMessage("The length should be from 1 to 100 symbols");
const content = (0, express_validator_1.body)("content").isString().withMessage("content should be string").trim().isLength({ min: 1, max: 1000 }).withMessage("The length should be from 1 to 1000 symbols");
let blogId = () => {
    let params = (0, blogs_router_1.blogIds)();
    return (0, express_validator_1.body)("blogId").isString().withMessage("blogId should be string").trim().isLength({ min: 1 }).withMessage("The length should be > 0").isIn(params).withMessage(`${params} There is no blog with such ID`);
};
const inputValidationMw = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(index_1.STATUSES_HTTP.BAD_REQUEST_400)
            //@ts-ignore
            .json({ errorsMessages: result.array({ onlyFirstError: true }).map(val => ({ "message": val.msg, "field": val["path"] })) });
    }
    else {
        next();
    }
};
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    let foundPosts = exports.db_posts.posts;
    if (!foundPosts.length) {
        res.status(index_1.STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(index_1.STATUSES_HTTP.OK_200)
        .json(foundPosts);
});
exports.postsRouter.get('/:id', (req, res) => {
    const foundPost = exports.db_posts.posts.find(c => +c.id === +req.params.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    res.json(foundPost);
});
exports.postsRouter.delete('/:id', authorizationCheck, (req, res) => {
    const foundPost = exports.db_posts.posts.find(c => +c.id === +req.params.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    exports.db_posts.posts = exports.db_posts.posts.filter(c => +c.id !== +req.params.id);
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
exports.postsRouter.post('/', authorizationCheck, titleValidation, shortDescription, content, blogId(), inputValidationMw, (req, res) => {
    const createdPost = {
        "id": (+(new Date())).toString(),
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "blogId": req.body.blogId,
        "blogName": "BlogName"
    };
    exports.db_posts.posts.push(createdPost);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
exports.postsRouter.put('/:id', authorizationCheck, titleValidation, shortDescription, content, blogId(), inputValidationMw, (req, res) => {
    const foundPost = exports.db_posts.posts.find(c => +c.id === +req.params.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    foundPost.title = req.body.title;
    foundPost.shortDescription = req.body.shortDescription;
    foundPost.content = req.body.content;
    foundPost.blogId = req.body.blogId;
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
