import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";

export const getCommentViewModel = (comment: CommentDbModel): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}