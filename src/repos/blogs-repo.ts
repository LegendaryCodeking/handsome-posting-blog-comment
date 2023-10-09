import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogModelClass} from "../db/db";
import {injectable} from "inversify";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {HydratedDocument} from 'mongoose';

@injectable()
export class BlogsRepo {

    async save(instance: HydratedDocument<BlogDbModel>): Promise<void> {
        await instance.save()
    }

    async deleteBlog(id: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const blogInstance = await BlogModelClass.findOne({"_id": _id})
        if (!blogInstance) return false

        await blogInstance.deleteOne()

        return true

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