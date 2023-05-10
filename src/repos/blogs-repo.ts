import {BlogType} from "../models/BlogModel";
import {BlogViewModel} from "../models/BlogViewModel";

let db_blogs: {blogs: BlogType[]} = {
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
}

const getBlogViewModel = (blog:BlogType): BlogViewModel => {
    return {
        "id": blog.id,
        "name": blog.name,
        "description": blog.description,
        "websiteUrl": blog.websiteUrl
    }
}


export const blogsRepo = {
    findBlogs() {
        return db_blogs.blogs.map(blog => getBlogViewModel(blog));
    },
    findBlogById(id: string) {
        let foundBlog = db_blogs.blogs.find(c => +c.id === +id);
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return foundBlog
        }
    },
    deleteBlog(id: string) {
        const foundBlog = db_blogs.blogs.find(c => +c.id === +id)

        if (foundBlog) {
            db_blogs.blogs = db_blogs.blogs.filter(c => +c.id !== +id)
            return true;
        } else {
            return false;
        }
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const createdBlog = {
            "id": (+(new Date())).toString(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl
        }

        db_blogs.blogs.push(createdBlog)

        return createdBlog;
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string) {

        const foundBlog = db_blogs.blogs.find(c => +c.id === +id);

        if (foundBlog) {
            foundBlog.name = name;
            foundBlog.description = description;
            foundBlog.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteAll(){
        db_blogs.blogs = [];
    }
}