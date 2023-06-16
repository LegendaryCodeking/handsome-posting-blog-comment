import {
    CommentViewModel,
} from "../models/CommentModel";
import {Request, Response} from "express";
import {commentService} from "../domain/comment-service";
import {STATUSES_HTTP} from "../enum/http-statuses";


export const commentsController = {
    async findCommentById(req: Request, res: Response) {
        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        } else {
            res.json(foundComment)
        }
    },

    async updateComment(req: Request, res: Response) {
        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if (foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let updateStatus: boolean = await commentService.updateComment(req.params.id, req.body.content)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    },

    async deleteComment(req: Request, res: Response) {

        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if (foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let deletionStatus: boolean = await commentService.deleteComment(req.params.id)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }

}