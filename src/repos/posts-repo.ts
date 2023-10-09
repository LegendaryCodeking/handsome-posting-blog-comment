import {PostModelClass} from "../db/db";
import {postDBMethodsType, PostDBModel} from "../models/Posts/PostModel";
import {injectable} from "inversify";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {HydratedDocument} from "mongoose";

@injectable()
export class PostsRepo {

    async save(instance: HydratedDocument<PostDBModel>): Promise<void> {
        await instance.save()
    }

    async deletePost(id: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const postInstance = await PostModelClass.findOne({"_id": _id})
        if (!postInstance) return false

        await postInstance.deleteOne()

        return true
    }

    async findPostsById(id: string): Promise<HydratedDocument<PostDBModel,postDBMethodsType> | null> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundPost: HydratedDocument<PostDBModel,postDBMethodsType> | null = await PostModelClass.findOne({"_id": _id})
        if (foundPost) {
            return foundPost
        } else {
            return null
        }
    }
}