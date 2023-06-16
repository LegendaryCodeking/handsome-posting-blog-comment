import {CommentDbModel, CommentViewModel, CreateCommentModel} from "../models/CommentModel";

export const getCommentViewModel = (comment: CommentDbModel | CreateCommentModel): CommentViewModel => {
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