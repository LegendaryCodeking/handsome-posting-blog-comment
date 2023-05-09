"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const blogs_repo_1 = require("../repos/blogs-repo");
const posts_repo_1 = require("../repos/posts-repo");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => {
    blogs_repo_1.blogsRepo.deleteAll();
    posts_repo_1.postsRepo.deleteAll();
    res.sendStatus(index_1.STATUSES_HTTP.NO_CONTENT_204);
});
