import {CommentsRepo} from "../repos/comments-repo";
import {CommentDbModel} from "../models/Comments/CommentModel";
import {likesDBModel, likesInfoViewModel, likeStatusModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {LikesRepo} from "../repos/like-repo";
import {inject, injectable} from "inversify";

@injectable()
export class CommentService {

    constructor(@inject(CommentsRepo) protected commentsRepo: CommentsRepo,
                @inject(LikesRepo) protected likesRepo: LikesRepo) {
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return this.commentsRepo.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepo.deleteComment(id);
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentDbModel> {
        const newComment = CommentDbModel.createComment(
            postId,
            content,
            userId,
            userLogin
        )

        const newLikesInfo = likesDBModel.createLikesInfo(newComment._id.toString())

        await this.commentsRepo.save(newComment)
        await this.likesRepo.save(newLikesInfo)

        return newComment
    }

    async likeComment(commentId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string, userLogin: string): Promise<boolean> {
        const savedLikeStatus = likesInfo.myStatus
        let result: boolean = true
        if (savedLikeStatus === likeStatus.None) {
            if (newLikeStatus === likeStatus.Like) {
                result = await this.likesRepo.Like('Comment', commentId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.Dislike) {
                result = await this.likesRepo.Dislike('Comment', commentId, userId, userLogin)
            }
        }

        if (savedLikeStatus === likeStatus.Like) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Like) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Dislike) {
                await this.likesRepo.Reset('Comment', commentId, userId, userLogin, likeStatus.Like)
                result = await this.likesRepo.Dislike('Comment', commentId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Comment', commentId, userId, userLogin, likeStatus.Like)
            }
        }

        if (savedLikeStatus === likeStatus.Dislike) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Dislike) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Like) {
                await this.likesRepo.Reset('Comment', commentId, userId, userLogin, likeStatus.Dislike)
                result = await this.likesRepo.Like('Comment', commentId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Comment', commentId, userId, userLogin, likeStatus.Dislike)
            }
        }

        return result
    }
}