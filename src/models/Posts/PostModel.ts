import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {PostDBModel} from "./PostDBModel";

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

export const postMongoSchema = new mongoose.Schema<PostDBModel>({
    "id": String,
    "title": String,
    "shortDescription": String,
    "content": String,
    "blogId": String,
    "blogName": String,
    "createdAt": String,
})
