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
exports.commentService = void 0;
const comments_repo_1 = require("../repos/comments-repo");
exports.commentService = {
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repo_1.commentsRepo.findCommentById(id);
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repo_1.commentsRepo.updateComment(id, content);
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repo_1.commentsRepo.deleteComment(id);
        });
    },
    createComment(postId, content, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                // В ID коммента будет вшит ID поста, к которому этот коммент оставлен
                "id": postId + "_._._" + (+(new Date())).toString(),
                "content": content,
                "commentatorInfo": {
                    "userId": userId,
                    "userLogin": userLogin
                },
                "createdAt": new Date().toISOString()
            };
            return comments_repo_1.commentsRepo.createComment(postId, newComment);
        });
    }
};
