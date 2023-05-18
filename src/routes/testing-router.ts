import {Router} from "express";
import {blogsRepo} from "../repos/blogs-repo";
import {postsRepo} from "../repos/posts-repo";
import {STATUSES_HTTP} from "./http-statuses-const";

export const testingRouter = Router({})


testingRouter.delete('/all-data', (req, res) => {
    blogsRepo.deleteAll();
    postsRepo.deleteAll();
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})