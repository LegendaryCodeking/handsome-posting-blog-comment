import {BlogType} from "../models/BlogModel";
import {blogsCollection} from "../db/db";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";

export const blogsRepo = {
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async createBlog(createdBlog: BlogType): Promise<BlogType> {
        await blogsCollection.insertOne(createdBlog)

        //return createdBlog;
        return getBlogViewModel(createdBlog)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({"id": id}, {
            $set: {
                "name": name,
                "description": description,
                "websiteUrl": websiteUrl
            }
        })
        return result.matchedCount === 1
    },

}