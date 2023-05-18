import {BlogType} from "../models/BlogModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogsCollection} from "./db";

let __db_blogs: { blogs: BlogType[] } = {
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

const getBlogViewModel = (blog: BlogType): BlogViewModel => {
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
        let foundBlog: BlogType | null = await blogsCollection.findOne({"id": id})
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
        const createdBlog = {
            "id": (+(new Date())).toString(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl
        }

        await blogsCollection.insertOne(createdBlog)

        return createdBlog;
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({"id": id},{$set: {
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl
        }})
       return result.matchedCount === 1
    },
    async deleteAll() {
        await blogsCollection.drop()
    }
}