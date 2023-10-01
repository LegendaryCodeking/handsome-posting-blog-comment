import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";
import {likeStatus} from "../enum/likeStatuses";
import {likesQueryRepo} from "../repos/query-repos/likes-query-repo";


export const getCommentViewModel = async (comment: CommentDbModel, userId?: string | undefined): Promise<CommentViewModel> => {

    const likesInfo = await likesQueryRepo.findLikesByOwnerId("Comment", comment._id.toString(), userId)
        ?? {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: likeStatus.None
        }

    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: likesInfo
    }
}