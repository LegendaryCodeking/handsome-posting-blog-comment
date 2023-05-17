import {BlogType} from "../models/BlogModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogsCollection} from "./db";

let __db_blogs: {blogs: BlogType[]} = {
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
    async findBlogs(): Promise<BlogType[]> {
        return blogsCollection.find({}).map(blog => getBlogViewModel(blog)).toArray();
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        let foundBlog: BlogType | null  = await blogsCollection.findOne({"id": id})
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    },
    deleteBlog(id: string) {
        const foundBlog = __db_blogs.blogs.find(c => +c.id === +id)

        if (foundBlog) {
            __db_blogs.blogs = __db_blogs.blogs.filter(c => +c.id !== +id)
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

        __db_blogs.blogs.push(createdBlog)

        return createdBlog;
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string) {

        const foundBlog = __db_blogs.blogs.find(c => +c.id === +id);

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
        __db_blogs.blogs = [];
    }
}