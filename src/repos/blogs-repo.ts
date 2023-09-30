import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogModelClass} from "../db/db";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";

class BlogsRepo {
    async deleteBlog(id: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await BlogModelClass.deleteOne({"id": id});
        // return result.deletedCount === 1

        const blogInstance = await BlogModelClass.findOne({"id": id})
        if (!blogInstance) return false

        await blogInstance.deleteOne()

        return true

    }

    async createBlog(createdBlog: BlogDbModel): Promise<BlogDbModel> {
        // Mongo native driver code
        // await BlogModel.insertMany([createdBlog])
        const blogInstance = new BlogModelClass()

        blogInstance.id = createdBlog.id
        blogInstance.name = createdBlog.name
        blogInstance.description = createdBlog.description
        blogInstance.websiteUrl = createdBlog.websiteUrl
        blogInstance.createdAt = createdBlog.createdAt
        blogInstance.isMembership = createdBlog.isMembership

        await blogInstance.save() // await т.к. сохранение асинхронное

        return getBlogViewModel(createdBlog)
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await BlogModelClass.updateOne({"id": id}, {
        //     $set: {
        //         "name": name,
        //         "description": description,
        //         "websiteUrl": websiteUrl
        //     }
        // })

        const blogInstance = await BlogModelClass.findOne({"id": id})
        if (!blogInstance) return false

        blogInstance.name = name
        blogInstance.description = description
        blogInstance.websiteUrl = websiteUrl

        await blogInstance.save()
        return true

        // Mongo native driver code
        // return result.matchedCount === 1
    }
}

export const blogsRepo = new BlogsRepo()