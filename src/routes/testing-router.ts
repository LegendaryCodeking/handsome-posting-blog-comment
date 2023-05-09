import {Router} from "express";
import {STATUSES_HTTP} from "../index";
import {blogsRepo} from "../repos/blogs-repo";
import {postsRepo} from "../repos/posts-repo";

export const testingRouter = Router({})


testingRouter.delete('/all-data', (req, res) => {
    blogsRepo.deleteAll()
    postsRepo.deleteAll()
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})