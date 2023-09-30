import {CommentModelClass} from "../db/db";
import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";
import {getCommentViewModel} from "../helpers/map-CommentViewModel";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";

class CommentsRepo {
    async updateComment(id: string, content: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await CommentModelClass.updateOne({"id": id}, {
        //     $set: {
        //         "content": content
        //     }
        // })
        // return result.matchedCount === 1
        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()

        return true
    }

    async deleteComment(id: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await CommentModelClass.deleteOne({"id": id})
        // return result.deletedCount === 1

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()

        return true


    }

    async createComment(newComment: CommentDbModel): Promise<CommentViewModel> {
        // Mongo native driver code
        // await CommentModelClass.insertMany([newComment])

        const commentInstance = new CommentModelClass()

        commentInstance._id = newComment._id
        commentInstance.postId = newComment.postId
        commentInstance.content = newComment.content
        commentInstance.commentatorInfo = newComment.commentatorInfo
        commentInstance.createdAt = newComment.createdAt

        await commentInstance.save();

        return getCommentViewModel(newComment);
    }
}

export const commentsRepo = new CommentsRepo()