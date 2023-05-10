"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const testing_router_1 = require("./routes/testing-router");
exports.app = (0, express_1.default)();
const port = 7050;
const jsonBodyMW = express_1.default.json();
exports.app.use(jsonBodyMW);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/testing', testing_router_1.testingRouter);
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
