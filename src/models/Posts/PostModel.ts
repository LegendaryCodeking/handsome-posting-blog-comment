import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {WithPagination} from "../custom";
import {extendedLikesInfoViewModel} from "../Comments/LikeModel";

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

export type PostType = {
    _id?: ObjectId,
    "id": string
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string,
}


export class PostDBModel {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
    ) {
    }
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
    "id": String,
    "title": String,
    "shortDescription": String,
    "content": String,
    "blogId": String,
    "blogName": String,
    "createdAt": String,
})
