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
exports.commentsRepo = void 0;
const db_1 = require("./db");
const getCommentViewModel = (comment) => {
    return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    };
};
exports.commentsRepo = {
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // async findCommentById(id: string): Promise<CommentViewModel | null> {
            let postId = id.split("_._._")[0];
            let foundComment = yield db_1.postsCollection.findOne({ "id": postId }, {});
            if (foundComment) {
                return getCommentViewModel(foundComment);
            }
            else {
                return null;
            }
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            let postId = id.split("_._._")[0];
            let result = yield db_1.postsCollection.updateOne({ "id": postId, "comments.id": id }, {
                $set: {
                    "comments.$.content": content
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.postsCollection.deleteOne({ "id": id });
            return result.deletedCount === 1;
        });
    },
    createComment(postId, newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.updateOne({ "id": postId }, { $push: { ["comments"]: newComment } });
            return getCommentViewModel(newComment);
        });
    }
};
