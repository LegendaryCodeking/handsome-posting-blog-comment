import {ObjectId} from "mongodb";
import mongoose, {Model} from "mongoose";
import {PostDBModel} from "../../models/Posts/PostModel";

export type postDBMethodsType = {
    updatePost: (title: string, shortDescription: string, content: string, blogId: string) => void
}

export type postModelType = Model<PostDBModel,{},postDBMethodsType>


export const postMongoSchema = new mongoose.Schema<PostDBModel,postModelType,postDBMethodsType>({
    "_id": ObjectId,
    "title": String,
    "shortDescription": String,
    "content": String,
    "blogId": String,
    "blogName": String,
    "createdAt": String,
})

postMongoSchema.method('updatePost', function updatePost(title, shortDescription, content, blogId): void {
    this.title = title
    this.shortDescription = shortDescription
    this.content = content
    this.blogId = blogId
});
