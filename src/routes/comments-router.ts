import {Request, Response, Router} from "express";
import {authenticationCheckBearer} from "../middlewares/auth-mw";
import {STATUSES_HTTP} from "./http-statuses-const";
import {commentService} from "../domain/comment-service";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {CommentViewModel} from "../models/CommentModel";

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        } else {
            res.json(foundComment)
        }
    }
)

commentsRouter.put('/:id',
    authenticationCheckBearer,
    contentValidation,
    inputValidationMw,
    async (req: Request, res: Response) => {
        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if(foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let updateStatus: boolean = await commentService.updateComment(req.params.id, req.body.content)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
)

commentsRouter.delete('/:id',
    authenticationCheckBearer,
    inputValidationMw,
    async (req: Request, res: Response) => {

        let foundComment: CommentViewModel | null = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        if(foundComment.commentatorInfo.userId !== req.user!.id) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let deletionStatus: boolean = await commentService.deleteComment(req.params.id)
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
)
