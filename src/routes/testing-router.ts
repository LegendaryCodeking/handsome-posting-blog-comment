import {Request, Response, Router} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostModelClass, BlogModelClass, UserModelClass, CommentModelClass, SessionModelClass, RateLimitModelClass} from "../db/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        BlogModelClass.deleteMany({}),
        PostModelClass.deleteMany({}),
        CommentModelClass.deleteMany({}),
        UserModelClass.deleteMany({}),
        SessionModelClass.deleteMany({}),
        RateLimitModelClass.deleteMany({})
    ]).catch((e) => {
        console.log(e)
        return res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
    })

    return res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})