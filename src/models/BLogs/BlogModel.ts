import {HydratedDocument} from "mongoose";
import {WithPagination} from "../custom";
import {ObjectId} from "mongodb";
import {BlogModelClass} from "../../db/db";

export class BlogDbModel {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {
    }

    static createBlog(name: string, description: string, websiteUrl: string): HydratedDocument<BlogDbModel> {

        const blogInstance = new BlogModelClass()
        blogInstance.name = name
        blogInstance.description = description
        blogInstance.websiteUrl = websiteUrl
        blogInstance._id = new ObjectId()
        blogInstance.createdAt = new Date().toISOString()
        blogInstance.isMembership = false

        return blogInstance
    }
}

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

export type BlogViewModel = {
    "id": string,
    "name": string,
    "description": string,
    "websiteUrl": string,
    "createdAt": string,
    "isMembership": boolean
}

export type BlogsWithPaginationModel = WithPagination<BlogViewModel>

export type URIParamsBlogIdModel = {
    /*
    * id of existing post :)
    */
    id: string
}
