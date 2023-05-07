"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = exports.db_posts = void 0;
const express_1 = require("express");
const index_1 = require("../index");
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
exports.postsRouter.delete('/:id', (req, res) => {
    const foundPost = exports.db_posts.posts.find(c => +c.id === +req.params.id);
    if (!foundPost) {
        res.sendStatus(index_1.STATUSES_HTTP.NOT_FOUND_404);
        return;
    }
    exports.db_posts.posts = exports.db_posts.posts.filter(c => +c.id !== +req.params.id);
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
exports.postsRouter.post('/', (req, res) => {
    const createdPost = {
        "id": (+(new Date())).toString(),
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "blogId": req.body.blogId,
        "blogName": req.body.blogName
    };
    exports.db_posts.posts.push(createdPost);
    res.status(index_1.STATUSES_HTTP.CREATED_201)
        .json(createdPost);
});
// postsRouter.put('/:id',
//     (req, res) => {
//
//         const foundPost = db_posts.posts.find(c => +c.id === +req.params.id);
//
//         if (!foundPost) {
//             res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
//             return;
//         }
//
//         foundPost.name = req.body.title;
//         foundPost.description = req.body.author;
//         foundPost.websiteUrl = req.body.availableResolutions;
//
//         res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
//     }
// )
