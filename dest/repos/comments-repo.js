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
    findComments(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const findFilter = { postId: queryFilter.postId };
            const sortFilter = (queryFilter.sortBy === 'createdAt' ? { [queryFilter.sortBy]: queryFilter.sortDirection } : { [queryFilter.sortBy]: queryFilter.sortDirection, 'createdAt': 1 });
            let foundComments = yield db_1.commentsCollection
                .find(findFilter)
                .sort(sortFilter)
                .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
                .limit(queryFilter.pageSize)
                .map(value => getCommentViewModel(value)).toArray();
            let totalCount = yield db_1.commentsCollection.countDocuments(findFilter);
            return {
                "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
                "page": queryFilter.pageNumber,
                "pageSize": queryFilter.pageSize,
                "totalCount": totalCount,
                "items": foundComments
            };
        });
    },
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundComment = yield db_1.commentsCollection.findOne({ "id": id });
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
            let result = yield db_1.commentsCollection.updateOne({ "id": id }, {
                $set: {
                    "content": content
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.commentsCollection.deleteOne({ "id": id });
            return result.deletedCount === 1;
        });
    },
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.commentsCollection.insertOne(newComment);
            return getCommentViewModel(newComment);
        });
    }
};
