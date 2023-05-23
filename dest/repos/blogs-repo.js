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
exports.blogsRepo = void 0;
const db_1 = require("./db");
const getBlogViewModel = (blog) => {
    return {
        "id": blog.id,
        "name": blog.name,
        "description": blog.description,
        "websiteUrl": blog.websiteUrl,
        "createdAt": blog.createdAt,
        "isMembership": blog.isMembership
    };
};
exports.blogsRepo = {
    findBlogs(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            let re = new RegExp(queryFilter.searchNameTerm + "");
            const findFilter = queryFilter.searchNameTerm === null ? {} : { "name": re };
            let foundBlogs = yield db_1.blogsCollection
                .find(findFilter)
                .sort({ [queryFilter.sortBy]: (queryFilter.sortDirection === 'asc' ? 1 : -1) })
                .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
                .limit(queryFilter.pageSize)
                .map(blog => getBlogViewModel(blog)).toArray();
            let totalCount = yield db_1.blogsCollection
                .find(findFilter).toArray();
            return {
                "pagesCount": Math.floor(totalCount.length / queryFilter.pageSize),
                "page": queryFilter.pageNumber,
                "pageSize": queryFilter.pageSize,
                "totalCount": totalCount.length,
                "items": foundBlogs
            };
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundBlog = yield db_1.blogsCollection.findOne({ "id": id });
            if (foundBlog) {
                return getBlogViewModel(foundBlog);
            }
            else {
                return null;
            }
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ "id": id });
            return result.deletedCount === 1;
        });
    },
    createBlog(createdBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.insertOne(createdBlog);
            //return createdBlog;
            return getBlogViewModel(createdBlog);
        });
    },
    updateBlog(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ "id": id }, {
                $set: {
                    "name": name,
                    "description": description,
                    "websiteUrl": websiteUrl
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.deleteMany({});
        });
    }
};
