import {Request, Response, Router} from "express";
import {authorizationCheck} from "../middlewares/authorization-mw";
import {STATUSES_HTTP} from "./http-statuses-const";
import {commentService} from "../domain/comment-service";
import {CommentViewModel} from "../models/CommentViewModel";

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let foundComment: CommentViewModel = await commentService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        } else {
            res.json(foundComment)
        }
    }
)

commentsRouter.put('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let updateStatus: boolean = await commentService.updateComment(req.params.id)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)

commentsRouter.delete('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let deletionStatus: boolean = await commentService.deleteComment(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)
