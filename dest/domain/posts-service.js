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
exports.postsService = void 0;
const posts_repo_1 = require("../repos/posts-repo");
exports.postsService = {
    findPosts(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repo_1.postsRepo.findPosts(queryFilter);
        });
    },
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repo_1.postsRepo.findPostsById(id);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repo_1.postsRepo.deletePost(id);
        });
    },
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = {
                "id": (+(new Date())).toString(),
                "title": title,
                "shortDescription": shortDescription,
                "content": content,
                "blogId": blogId,
                "blogName": "BlogName",
                "createdAt": new Date().toISOString()
            };
            return yield posts_repo_1.postsRepo.createPost(createdPost);
        });
    },
    updatePost(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repo_1.postsRepo.updatePost(id, title, shortDescription, content, blogId);
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield posts_repo_1.postsRepo.deleteAll();
        });
    }
};
