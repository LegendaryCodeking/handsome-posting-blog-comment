import {CommentViewModel} from "../models/CommentViewModel";
import {postsCollection} from "./db";
import {CommentModel} from "../models/CommentModel";


const getCommentViewModel = (comment: CommentModel): CommentViewModel => {
    return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}


export const commentsRepo = {

    async findCommentById(id: string): Promise<CommentViewModel | null> {
        let foundComment: CommentModel | null = await postsCollection.findOne({"id": id})
        if (foundComment) {
            return getCommentViewModel(foundComment)
        } else {
            return null
        }

    },
    async updateComment(id: string, content: string): Promise<boolean> {
        let postId = id.split("_._._")[0]
        let result = await postsCollection.updateOne({"id": postId, "comments.id": id }, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        let result = await postsCollection.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createComment(postId: string, newComment: CommentViewModel ): Promise<CommentViewModel> {
        await postsCollection.updateOne({"id": postId},{$push: {["comments"]: newComment }})
        return getCommentViewModel(newComment);
    }
}