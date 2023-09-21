import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogModel} from "../db/db";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";

export const blogsRepo = {
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async createBlog(createdBlog: BlogDbModel): Promise<BlogDbModel> {
        await BlogModel.insertMany([createdBlog])

        return getBlogViewModel(createdBlog)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModel.updateOne({"id": id}, {
            $set: {
                "name": name,
                "description": description,
                "websiteUrl": websiteUrl
            }
        })
        return result.matchedCount === 1
    },

}