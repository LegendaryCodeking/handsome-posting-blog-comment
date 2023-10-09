import {CommentsRepo} from "../repos/comments-repo";
import {CommentDbModel} from "../models/Comments/CommentModel";
import {likesDBModel, likesInfoViewModel, likeStatusModel} from "../models/Comments/LikeModel";
import {LikesRepo} from "../repos/like-repo";
import {inject, injectable} from "inversify";
import {LikeService} from "./like-service";

@injectable()
export class CommentService {

    constructor(@inject(CommentsRepo) protected commentsRepo: CommentsRepo,
                @inject(LikesRepo) protected likesRepo: LikesRepo,
                @inject(LikeService) protected likesService: LikeService
    ) {
    }

    async updateComment(id: string, content: string): Promise<boolean> {

        const foundComment = await this.commentsRepo.findCommentById(id)
        if (!foundComment) return false

        foundComment.updateComment(content)
        await this.commentsRepo.save(foundComment)
        return true
    }

    async deleteComment(id: string): Promise<boolean> {
        const foundComment = await this.commentsRepo.findCommentById(id)
        if (!foundComment) return false

        return this.commentsRepo.deleteComment(foundComment)
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentDbModel> {
        const newComment = CommentDbModel.createComment(
            postId,
            content,
            userId,
            userLogin
        )

        const newLikesInfo = likesDBModel.createLikesInfo(newComment._id.toString(), "Comment")

        await this.commentsRepo.save(newComment)
        await this.likesRepo.save(newLikesInfo)

        return newComment
    }

    async likeComment(commentId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string, userLogin: string): Promise<boolean> {
        return await this.likesService.likeEntity("Comment", commentId, likesInfo, newLikeStatus, userId, userLogin)
    }
}