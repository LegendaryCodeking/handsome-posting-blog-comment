"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const http_statuses_const_1 = require("./http-statuses-const");
const blogs_service_1 = require("../domain/blogs-service");
const posts_service_1 = require("../domain/posts-service");
const user_service_1 = require("../domain/user-service");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => {
    blogs_service_1.blogsService.deleteAll();
    posts_service_1.postsService.deleteAll();
    user_service_1.userService.deleteAll();
    res.sendStatus(http_statuses_const_1.STATUSES_HTTP.NO_CONTENT_204);
});
