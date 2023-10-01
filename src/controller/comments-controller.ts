import {CommentViewModel,} from "../models/Comments/CommentModel";
import {Request, Response} from "express";
import {CommentService} from "../domain/comment-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {CommentsQueryRepo} from "../repos/query-repos/comments-query-repo";
import {likesQueryRepo} from "../repos/query-repos/likes-query-repo";
import {likesInfoViewModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {likesRepo} from "../repos/like-repo";

export class CommentsController {
    constructor(
        protected commentsQueryRepo: CommentsQueryRepo,
        protected commentService: CommentService
    ) {
    }

    async findCommentById(req: Request, res: Response) {
        let foundComment: CommentViewModel | null = await this.commentsQueryRepo.findCommentById(req.params.id, req.user?.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        } else {
            res.json(foundComment)
        }
    }

    async updateComment(req: Request, res: Response) {
        let foundComment: CommentViewModel | null = await this.commentsQueryRepo.findCommentById(req.params.id,req.user!.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if (foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let updateStatus: boolean = await this.commentService.updateComment(req.params.id, req.body.content)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }

    async deleteComment(req: Request, res: Response) {

        let foundComment: CommentViewModel | null = await this.commentsQueryRepo.findCommentById(req.params.id,req.user!.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if (foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let deletionStatus: boolean = await this.commentService.deleteComment(req.params.id)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }

    async sendLikeStatus(req: Request, res: Response) {
        const newLikeStatus = req.body.likeStatus
        let foundComment: CommentViewModel | null = await this.commentsQueryRepo.findCommentById(req.params.id,req.user!.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        const likesInfo: likesInfoViewModel | null =
            await likesQueryRepo.findLikesByOwnerId('Comment', req.params.id, req.user!.id)
        if (!likesInfo) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500)
                .json({errorsMessage: "Unable to get likes info from DB"})
            return;
        }

        const savedLikeStatus = likesInfo.myStatus

        if(savedLikeStatus === likeStatus.None) {
            if(newLikeStatus === likeStatus.Like) {
                await likesRepo.Like('Comment', req.params.id, req.user!.id)
            }
            if(newLikeStatus === likeStatus.Dislike) {
                await likesRepo.Dislike('Comment', req.params.id, req.user!.id)
            }
        }

        if(savedLikeStatus === likeStatus.Like) {
            if(newLikeStatus === likeStatus.Like) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            }
            if(newLikeStatus === likeStatus.Dislike) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
                await likesRepo.Dislike('Comment', req.params.id, req.user!.id)
            }
            if(newLikeStatus === likeStatus.None) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            }
        }

        if(savedLikeStatus === likeStatus.Dislike) {
            if(newLikeStatus === likeStatus.Dislike) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            }
            if(newLikeStatus === likeStatus.Like) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
                await likesRepo.Like('Comment', req.params.id, req.user!.id)
            }
            if(newLikeStatus === likeStatus.None) {
                await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            }
        }



    }
}