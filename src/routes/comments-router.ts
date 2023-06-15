import {Request, Response, Router} from "express";
import {authorizationCheckBearer} from "../middlewares/authorization-mw";
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
    authorizationCheckBearer,
    contentValidation,
    inputValidationMw,
    async (req: Request, res: Response) => {
        let updateStatus: boolean = await commentService.updateComment(req.params.id, req.body.content)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)

commentsRouter.delete('/:id',
    authorizationCheckBearer,
    inputValidationMw,
    async (req: Request, res: Response) => {
        let deletionStatus: boolean = await commentService.deleteComment(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)
