import {Request, Response, Router} from "express";
import {authorizationCheck} from "../middlewares/authorization-mw";
import {userService} from "../domain/user-service";
import {STATUSES_HTTP} from "./http-statuses-const";

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let deletionStatus: boolean = await userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)

commentsRouter.put('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let deletionStatus: boolean = await userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)

commentsRouter.delete('/:id',
    authorizationCheck,
    async (req: Request, res: Response) => {
        let deletionStatus: boolean = await userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)
