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

    async findBlogById(id: string): Promise<HydratedDocument<BlogDbModel> | null> {
        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundBlog: HydratedDocument<BlogDbModel> | null = await BlogModelClass.findOne({"_id": _id})
        if (foundBlog) {
            return foundBlog
        } else {
            return null
        }
    }
}