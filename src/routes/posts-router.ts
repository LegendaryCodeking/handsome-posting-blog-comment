import {Request, Response, Router} from 'express'
import {postsRepo} from "../repos/posts-repo";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {authorizationCheck} from "../middlewares/authorization-mw";
import {blogId, content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {STATUSES_HTTP} from "./http-statuses-const";
import {RequestWithParams} from "../types/posts-types";
import {PostViewModel} from "../models/PostViewModel";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request,
                      res: Response<PostViewModel[]>) => {
    let foundPosts = await postsRepo.findPosts();
    if (!foundPosts.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundPosts)
})

postsRouter.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>,
                         res: Response) => {
    const foundPost = await postsRepo.findProductById(req.params.id);

    if (!foundPost) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundPost)
})

postsRouter.delete('/:id',
    authorizationCheck,
    async (req: RequestWithParams<URIParamsPostIdModel>,
     res: Response) => {
    const deletionStatus = await postsRepo.deletePost(req.params.id)
    if (deletionStatus) {
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
    }
})

postsRouter.post('/',
    authorizationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    async (req: Request,
     res: Response<PostViewModel>) => {
        let createdPost = await postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    })

postsRouter.put('/:id',
    authorizationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    async (req: RequestWithParams<URIParamsPostIdModel>,
     res: Response) => {
        let updateStatus = await postsRepo.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)