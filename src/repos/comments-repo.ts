import {commentsCollection} from "./db";
import {CommentDbModel, CommentViewModel, CreateCommentModel} from "../models/CommentModel";


const getCommentViewModel = (comment: CommentDbModel | CreateCommentModel): CommentViewModel => {
    return {
        id: comment.id,
        postId: comment.postId,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}


export const commentsRepo = {

    async findCommentById(id: string): Promise<any> {
        let foundComment = await commentsCollection.findOne({"id": id})
        if (foundComment) {
            return getCommentViewModel(foundComment)
        } else {
            return null
        }

    },
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
    async createComment(newComment: CreateCommentModel ): Promise<CommentViewModel> {
        await commentsCollection.insertOne(newComment)
        return getCommentViewModel(newComment);
    }
}