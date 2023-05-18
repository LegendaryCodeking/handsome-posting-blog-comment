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
exports.postsRepo = void 0;
const db_1 = require("./db");
const getPostViewModel = (post) => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    };
};
exports.postsRepo = {
    findPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.postsCollection.find({}).map(post => getPostViewModel(post)).toArray();
        });
    },
    findProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundPost = yield db_1.postsCollection.findOne({ "id": id });
            if (foundPost) {
                return getPostViewModel(foundPost);
            }
            else {
                return null;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.postsCollection.deleteOne({ "id": id });
            return result.deletedCount === 1;
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
            yield db_1.postsCollection.insertOne(createdPost);
            return createdPost;
        });
    },
    updatePost(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.postsCollection.updateOne({ "id": id }, {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            });
            return result.matchedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.deleteMany({});
        });
    }
};
