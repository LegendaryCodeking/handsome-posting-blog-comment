import {BlogType} from "../models/BlogModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogsCollection} from "./db";

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
         await blogsCollection.deleteMany({});
        // db.createCollection("blogs")

    }
}