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
let __db_blogs = {
    blogs: [
        {
            "id": "1",
            "name": "Marieh Kondo",
            "description": "Bingo article about Marieh Kondo and his famous book",
            "websiteUrl": "https://telegra.ph/Marieh-Kondo-02-14"
        },
        {
            "id": "2",
            "name": "Meandr",
            "description": "Bingo article about Meandr",
            "websiteUrl": "https://telegra.ph/Meandr-02-14"
        },
        {
            "id": "3",
            "name": "Dzhiro dItaliya",
            "description": "Bingo article about famous italian bicycle race Dzhiro dItaliya",
            "websiteUrl": "https://telegra.ph/Dzhiro-dItaliya-02-13"
        }
    ]
};
const getBlogViewModel = (blog) => {
    return {
        "id": blog.id,
        "name": blog.name,
        "description": blog.description,
        "websiteUrl": blog.websiteUrl
    };
};
exports.blogsRepo = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.blogsCollection.find({}).map(blog => getBlogViewModel(blog)).toArray();
        });
    },
    findBlogById(id) {
        let foundBlog = __db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            return getBlogViewModel(foundBlog);
        }
        else {
            return foundBlog;
        }
    },
    deleteBlog(id) {
        const foundBlog = __db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            __db_blogs.blogs = __db_blogs.blogs.filter(c => +c.id !== +id);
            return true;
        }
        else {
            return false;
        }
    },
    createBlog(name, description, websiteUrl) {
        const createdBlog = {
            "id": (+(new Date())).toString(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl
        };
        __db_blogs.blogs.push(createdBlog);
        return createdBlog;
    },
    updateBlog(id, name, description, websiteUrl) {
        const foundBlog = __db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    },
    deleteAll() {
        __db_blogs.blogs = [];
    }
};
