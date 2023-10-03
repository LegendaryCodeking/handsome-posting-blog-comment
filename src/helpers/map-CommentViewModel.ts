import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";
import {likeStatus} from "../enum/likeStatuses";
import {LikesQueryRepo} from "../repos/query-repos/likes-query-repo";
import {injectable} from "inversify";

@injectable()
export class MapCommentViewModel {

    constructor(protected likesQueryRepo: LikesQueryRepo ){

    }

    async getCommentViewModel (comment: CommentDbModel, userId?: string | undefined): Promise<CommentViewModel> {

        const likesInfo = await this.likesQueryRepo.findLikesByOwnerId("Comment", comment._id.toString(), userId)
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
}

