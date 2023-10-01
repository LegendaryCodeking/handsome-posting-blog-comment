import {CommentsRepo} from "../repos/comments-repo";
import {
    CommentDbModel,
    CommentViewModel
} from "../models/Comments/CommentModel";
import {ObjectId} from "mongodb";
import {likesDBModel, usersLikesConnectionDBModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";

export class CommentService {

    constructor(protected commentsRepo: CommentsRepo) {    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return this.commentsRepo.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepo.deleteComment(id);
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewModel> {
        const newComment = new CommentDbModel(
            new ObjectId(),
            postId,
            content,
            {
                "userId": userId,
                "userLogin": userLogin
            },
            new Date().toISOString()
        )

        const newLikesInfo = new likesDBModel(
            new ObjectId(),
            "Comment",
            newComment._id.toString(),
            0,
            0
        )

        const newUsersLikesConnection = new usersLikesConnectionDBModel(
            new ObjectId(),
            userId,
            newComment._id.toString(),
            "Comment",
            likeStatus.None
        )

        return this.commentsRepo.createComment(newComment,userId,newLikesInfo,newUsersLikesConnection);
    }
}