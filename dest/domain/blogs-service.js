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
exports.blogsService = void 0;
const blogs_repo_1 = require("../repos/blogs-repo");
exports.blogsService = {
    findBlogs(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repo_1.blogsRepo.findBlogs(queryFilter);
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repo_1.blogsRepo.findBlogById(id);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repo_1.blogsRepo.deleteBlog(id);
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = {
                "id": (+(new Date())).toString(),
                "name": name,
                "description": description,
                "websiteUrl": websiteUrl,
                "createdAt": new Date().toISOString(),
                "isMembership": false
            };
            return yield blogs_repo_1.blogsRepo.createBlog(createdBlog);
        });
    },
    updateBlog(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_repo_1.blogsRepo.updateBlog(id, name, description, websiteUrl);
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogs_repo_1.blogsRepo.deleteAll();
        });
    }
};
