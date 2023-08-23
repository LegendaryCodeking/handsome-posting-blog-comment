import {BlogCreateModel, BlogDbModel} from "../models/BLogs/BlogModel";
import {queryBlogPostPagination} from "../models/FilterModel";
import {BlogsWithPaginationModel} from "../models/BLogs/BlogsWithPaginationModel";
import {Request, Response} from "express";
import {blogsService} from "../domain/blogs-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {URIParamsBlogIdModel} from "../models/BLogs/URIParamsBlogIdModel";
import {BlogViewModel} from "../models/BLogs/BlogViewModel";
import {PostsWithPaginationModel} from "../models/Posts/PostsWithPaginationModel";
import {PostViewModel} from "../models/Posts/PostViewModel";
import {postsService} from "../domain/posts-service";
import {blogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {RequestsWithBody, RequestsWithParams} from "../models/requestModels";


export const blogsController = {

    async FindAllBlog(req: Request, res: Response<BlogsWithPaginationModel>) {
        let queryFilter = queryBlogPostPagination(req)
        let foundBlogs: BlogsWithPaginationModel = await blogsQueryRepo.FindAllBlog(queryFilter)

        if (!foundBlogs.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundBlogs);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundBlogs)
    },

    async findBlogById(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel>) {
        const foundBlog: BlogDbModel | null = await blogsQueryRepo.findBlogById(req.params.id)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }
        res.json(foundBlog)
    },

    async findPostsForBlog(req: Request, res: Response<PostsWithPaginationModel>) {
        const blogId = req.params.id
        const foundBlog: BlogDbModel | null = await blogsQueryRepo.findBlogById(blogId)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        const queryFilter = queryBlogPostPagination(req)

        let foundPosts = await blogsQueryRepo.findPostsByBlogId(queryFilter);

        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)

    },

    async deleteBlog(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response) {
        let deleteStatus: boolean = await blogsService.deleteBlog(req.params.id)
        if (deleteStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    },

    async createBlog(req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        let createdBlog: BlogDbModel = await blogsService
            .createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdBlog)
    },

    async createPostsForBlog(req: Request, res: Response<PostViewModel>) {

        const foundBlog: BlogDbModel | null = await blogsQueryRepo.findBlogById(req.params.id)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        let createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id.toString())
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    },

    async updateBlog(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response) {
        let updateStatus: boolean = await blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

}