import {Request, Response, Router} from "express";
import {STATUSES_HTTP} from "./http-statuses-const";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../repos/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        blogsCollection.deleteMany({}),
        postsCollection.deleteMany({}),
        commentsCollection.deleteMany({}),
        usersCollection.deleteMany({}),
    ]).catch((e) => {
        console.log(e)
        return res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
    })

    return res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})