import {BlogDbModel, BlogViewModel} from "../models/BLogs/BlogModel";
import {BlogModelClass} from "../db/db";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";
import {injectable} from "inversify";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";

@injectable()
export class BlogsRepo {
    async deleteBlog(id: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const blogInstance = await BlogModelClass.findOne({"_id": _id})
        if (!blogInstance) return false

        await blogInstance.deleteOne()

        return true

    }

    async createBlog(createdBlog: BlogDbModel): Promise<BlogViewModel> {
        const blogInstance = new BlogModelClass()

        blogInstance._id = createdBlog._id
        blogInstance.name = createdBlog.name
        blogInstance.description = createdBlog.description
        blogInstance.websiteUrl = createdBlog.websiteUrl
        blogInstance.createdAt = createdBlog.createdAt
        blogInstance.isMembership = createdBlog.isMembership

        await blogInstance.save() // await т.к. сохранение асинхронное

        return getBlogViewModel(createdBlog)
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const blogInstance = await BlogModelClass.findOne({"_id": _id})
        if (!blogInstance) return false

        blogInstance.name = name
        blogInstance.description = description
        blogInstance.websiteUrl = websiteUrl

        await blogInstance.save()
        return true
    }
}