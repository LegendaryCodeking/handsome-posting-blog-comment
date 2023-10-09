import {blogDBMethodsType, BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogModelClass} from "../db/db";
import {injectable} from "inversify";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {HydratedDocument} from 'mongoose';

@injectable()
export class BlogsRepo {

    async save(instance: HydratedDocument<BlogDbModel>): Promise<void> {
        await instance.save()
    }

    async deleteBlog(instance: HydratedDocument<BlogDbModel>): Promise<boolean> {

        await instance.deleteOne()
        return true

    }

    async findBlogById(id: string): Promise<HydratedDocument<BlogDbModel,blogDBMethodsType> | null> {
        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundBlog: HydratedDocument<BlogDbModel,blogDBMethodsType> | null = await BlogModelClass.findOne({"_id": _id})
        if (foundBlog) {
            return foundBlog
        } else {
            return null
        }
    }
}