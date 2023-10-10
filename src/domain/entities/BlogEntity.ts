import mongoose, {Model} from "mongoose";
import {ObjectId} from "mongodb";
import {BlogDbModel} from "../../models/BLogs/BlogModel";

export type blogDBMethodsType = {
    updateBlog: (name: string, description: string, websiteUrl: string) => void
}

export type blogModelType = Model<BlogDbModel, {}, blogDBMethodsType>

export const blogMongoSchema = new mongoose.Schema<BlogDbModel>({
    "_id": ObjectId,
    "name": String,
    "description": String,
    "websiteUrl": String,
    "createdAt": String,
    "isMembership": Boolean
})

blogMongoSchema.method('updateBlog', function updateBlog(name, description, websiteUrl): void {
    this.name = name
    this.description = description
    this.websiteUrl = websiteUrl
});
