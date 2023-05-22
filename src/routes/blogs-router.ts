import {Request, Response, Router} from 'express'
import {blogsService} from "../domain/blogs-service";
import {descriptionValidation, nameValidation, urlValidation} from "../middlewares/blog-validation-mw";
import {authorizationCheck} from "../middlewares/authorization-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {STATUSES_HTTP} from "./http-statuses-const";
import {RequestWithParamsBlog} from "../types/blogs-types";
import {URIParamsBlogIdModel} from "../models/URIParamsBlogIdModel";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogType} from "../models/BlogModel";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
    let foundBlogs: BlogType[] = await blogsService.findBlogs()

    if (!foundBlogs.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundBlogs)
})

blogsRouter.get('/:id', async (req: RequestWithParamsBlog<URIParamsBlogIdModel>, res: Response<BlogViewModel>) => {
    const foundBlog: BlogType | null = await blogsService.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundBlog)
})

blogsRouter.delete('/:id', authorizationCheck, async (req: RequestWithParamsBlog<URIParamsBlogIdModel>, res: Response) => {
    let deleteStatus: boolean = await blogsService.deleteBlog(req.params.id)
    if (deleteStatus) {
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
    }
})


blogsRouter.post('/',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    async (req: Request, res: Response<BlogViewModel>) => {
        let createdBlog: BlogType = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdBlog)
    })

blogsRouter.put('/:id',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    async (req: RequestWithParamsBlog<URIParamsBlogIdModel>, res: Response) => {
        let updateStatus: boolean = await blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)