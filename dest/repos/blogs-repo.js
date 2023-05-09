"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepo = void 0;
let db_blogs = {
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
exports.blogsRepo = {
    findBlogs() {
        return db_blogs.blogs;
    },
    findBlogById(id) {
        return db_blogs.blogs.find(c => +c.id === +id);
    },
    deleteBlog(id) {
        const foundBlog = db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            db_blogs.blogs = db_blogs.blogs.filter(c => +c.id !== +id);
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
        db_blogs.blogs.push(createdBlog);
        return createdBlog;
    },
    updateBlog(id, name, description, websiteUrl) {
        const foundBlog = db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    }
};
