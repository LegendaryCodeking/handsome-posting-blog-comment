import {commentsCollection} from "../db/db";
import {
    CommentDbModel,
    CommentViewModel
} from "../models/Comments/CommentModel";
import {getCommentViewModel} from "../helpers/map-CommentViewModel";


export const commentsRepo = {
    async updateComment(id: string, content: string): Promise<boolean> {
        let result = await commentsCollection.updateOne({"id": id}, {
            $set: {
                "content": content
            }
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        let result = await commentsCollection.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createComment(newComment: CommentDbModel ): Promise<CommentViewModel> {
        await commentsCollection.insertOne(newComment)
        return getCommentViewModel(newComment);
    }
}