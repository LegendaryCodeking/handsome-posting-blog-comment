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
import {BlogsFilterModel} from "../models/BlogsFilterModel";
import {PostFilterModel} from "../models/PostFilterModel";
import {postsService} from "../domain/posts-service";
import {PostViewModel} from "../models/PostViewModel";
import {blogId, content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
    let queryFilter: BlogsFilterModel = {
        searchNameTerm: req.query.searchNameTerm?.toString() || null,
        sortBy: req.query.sortBy?.toString() || "createdAt",
        sortDirection: (req.query.sortDirection === 'asc' ? 'asc' : undefined) ?? 'desc',
        pageNumber: +(req.query.pageNumber ?? 1),
        pageSize: +(req.query.pageSize ?? 10)
    }
    let foundBlogs: BlogType[] = await blogsService.findBlogs(queryFilter)

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

blogsRouter.get('/:id/posts', async (req: Request, res: Response<PostViewModel[]>) => {
    const foundBlog: BlogType | null = await blogsService.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    // Copy from posts-router
    let queryFilter: PostFilterModel = {
        sortBy: req.query.sortBy?.toString() || "createdAt",
        sortDirection: (req.query.sortDirection === 'asc' ? 'asc' : undefined) ?? 'desc',
        pageNumber: +(req.query.pageNumber ?? 1),
        pageSize: +(req.query.pageSize ?? 10),
        blogId: req.params.id.toString()
    }

    let foundPosts = await postsService.findPosts(queryFilter);
    if (!foundPosts.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundPosts)

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

blogsRouter.post('/:id/posts',
    authorizationCheck,
    titleValidation,
    shortDescription,
    content,
    inputValidationMw,
    async (req: Request,
           res: Response<PostViewModel>) => {
        let createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id.toString())
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
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