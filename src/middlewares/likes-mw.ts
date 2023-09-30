import {NextFunction, Request, Response} from "express";
import {likeStatus} from "../enum/likeStatuses";
import {STATUSES_HTTP} from "../enum/http-statuses";

export const likeStatusValidation = async (req: Request, res: Response, next: NextFunction) => {

    if (!Object.values(likeStatus).includes(req.body.likeStatus)) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "likeStatus field has wrong value", field: "likeStatus"}]}
            )
        return
    }

    next();
}