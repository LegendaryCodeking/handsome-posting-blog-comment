import {CommentModelClass} from "../db/db";
import {commentDBMethodsType, CommentDbModel} from "../models/Comments/CommentModel";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {inject, injectable} from "inversify";
import {MapCommentViewModel} from "../helpers/map-CommentViewModel";
import {HydratedDocument} from "mongoose";
import {postDBMethodsType, PostDBModel} from "../models/Posts/PostModel";

@injectable()
export class CommentsRepo {
    constructor(
        @inject(MapCommentViewModel) protected mapCommentViewModel: MapCommentViewModel
    ) {
    }

    async save(instance: HydratedDocument<CommentDbModel>): Promise<void> {
        await instance.save()
    }

    async findCommentById(id: string): Promise<HydratedDocument<CommentDbModel,commentDBMethodsType> | null> {
        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundComment: HydratedDocument<CommentDbModel,commentDBMethodsType> | null = await CommentModelClass.findOne({"_id": _id})
        if (foundComment) {
            return foundComment
        } else {
            return null
        }
    }


    async updateComment(id: string, content: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()

        return true
    }

    async deleteComment(id: string): Promise<boolean> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()

        return true
    }
}