import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";

export const getCommentViewModel = (comment: CommentDbModel): CommentViewModel => {
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