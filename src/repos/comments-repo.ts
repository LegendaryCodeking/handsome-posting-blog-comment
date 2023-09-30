import {CommentModelClass} from "../db/db";
import {
    CommentDbModel,
    CommentViewModel
} from "../models/Comments/CommentModel";
import {getCommentViewModel} from "../helpers/map-CommentViewModel";
import {ObjectId} from "mongodb";


export const commentsRepo = {
    async updateComment(id: string, content: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await CommentModelClass.updateOne({"id": id}, {
        //     $set: {
        //         "content": content
        //     }
        // })
        // return result.matchedCount === 1
        try {
            // Отлавливаем ошибку, когда в ID передается неверные данные
            // Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
            // BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
            const _id = new ObjectId(id);
            const commentInstance = await CommentModelClass.findOne({"_id": _id})
            if (!commentInstance) return false

            commentInstance.content = content

            await commentInstance.save()

            return true
        } catch (e) {
            return false
        }

    },
    async deleteComment(id: string): Promise<boolean> {

        // Mongo native driver code
        // let result = await CommentModelClass.deleteOne({"id": id})
        // return result.deletedCount === 1

        try {
            const _id = new ObjectId(id);
            const commentInstance = await CommentModelClass.findOne({"_id": _id})
            if (!commentInstance) return false

            await commentInstance.deleteOne()

            return true
        } catch {
            return false
        }


    },
    async createComment(newComment: CommentDbModel ): Promise<CommentViewModel> {
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