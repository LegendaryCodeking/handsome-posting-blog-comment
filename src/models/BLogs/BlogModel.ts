import mongoose from "mongoose";

export class BlogDbModel {
    constructor(
           public id: string,
           public name: string,
           public description: string,
           public websiteUrl: string,
           public createdAt: string,
           public isMembership: boolean
    ) { }
}

// export type BlogDbModel = {
//     "id": string,
//     "name": string,
//     "description": string,
//     "websiteUrl": string,
//     "createdAt": string,
//     "isMembership": boolean
// }

export type BlogCreateModel = {
    "name": string,
    "description": string,
    "websiteUrl": string,
}

export type BlogUpdateModel = {
    "name": string,
    "description": string,
    "websiteUrl": string,
}

export const blogMongoSchema = new mongoose.Schema<BlogDbModel>({
    "id": String,
    "name": String,
    "description": String,
    "websiteUrl": String,
    "createdAt": String,
    "isMembership": Boolean
})