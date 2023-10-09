import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument} from "mongoose";
import {WithPagination} from "../custom";
import {extendedLikesInfoViewModel} from "../Comments/LikeModel";
import {PostModelClass} from "../../db/db";


export class PostDBModel {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
    ) {
    }

    static createPost(title: string,
                      shortDescription: string,
                      content: string,
                      blogId: string,
                      blogName: string): HydratedDocument<PostDBModel> {

        const postInstance = new PostModelClass()
        postInstance._id = new ObjectId()
        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.blogId = blogId
        postInstance.blogName = blogName
        postInstance.createdAt = new Date().toISOString()

        return postInstance
    }
}


export type PostCreateModel = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}

export type PostUpdateModel = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}

export type PostViewModel = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string,
    "extendedLikesInfo": extendedLikesInfoViewModel
}

export type URIParamsPostIdModel = {
    /*
    * id of existing post :)
    */
    id: string
}

export type PostsWithPaginationModel = WithPagination<PostViewModel>

export const postMongoSchema = new mongoose.Schema<PostDBModel>({
    "_id": ObjectId,
    "title": String,
    "shortDescription": String,
    "content": String,
    "blogId": String,
    "blogName": String,
    "createdAt": String,
})
