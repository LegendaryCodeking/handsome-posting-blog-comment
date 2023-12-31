import {
    BlogCreateModel,
    BlogsWithPaginationModel,
    BlogViewModel,
    URIParamsBlogIdModel
} from "../models/BLogs/BlogModel";
import {queryBlogPostPagination} from "../models/FilterModel";
import {Request, Response} from "express";
import {BlogsService} from "../domain/blogs-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostsWithPaginationModel, PostViewModel} from "../models/Posts/PostModel";
import {PostsService} from "../domain/posts-service";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {RequestsWithBody, RequestsWithParams} from "../models/requestModels";
import {PostQueryRepo} from "../repos/query-repos/post-query-repo";
import {inject, injectable} from "inversify";
import {MapPostViewModel} from "../helpers/map-PostViewModel";

@injectable()
export class BlogsController {

    constructor(@inject(BlogsService) protected blogsService: BlogsService,
                @inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo,
                @inject(PostQueryRepo) protected postQueryRepo: PostQueryRepo,
                @inject(PostsService) protected postsService: PostsService,
                @inject(MapPostViewModel) protected mapPostViewModel: MapPostViewModel,
                ) {

    }

    async FindAllBlog(req: Request, res: Response<BlogsWithPaginationModel>) {
        let queryFilter = queryBlogPostPagination(req)
        let foundBlogs: BlogsWithPaginationModel = await this.blogsQueryRepo.FindAllBlog(queryFilter)

        if (!foundBlogs.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundBlogs);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundBlogs)
    }

    async findBlogById(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel>) {
        const foundBlog: BlogViewModel | null = await this.blogsQueryRepo.findBlogById(req.params.id)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }
        res.json(foundBlog)
    }

    async findPostsForBlog(req: Request, res: Response<PostsWithPaginationModel>) {
        const blogId = req.params.id
        const foundBlog: BlogViewModel | null = await this.blogsQueryRepo.findBlogById(blogId)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        const queryFilter = queryBlogPostPagination(req)

        let foundPosts = await this.postQueryRepo.findPosts(queryFilter, req.user?.id);

        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)

    }

    async deleteBlog(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response) {
        let deleteStatus: boolean = await this.blogsService.deleteBlog(req.params.id)
        if (deleteStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

    async createBlog(req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        let createdBlog: BlogViewModel = await this.blogsService
            .createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdBlog)
    }

    async createPostsForBlog(req: Request, res: Response<PostViewModel>) {

        const foundBlog: BlogViewModel | null = await this.blogsQueryRepo.findBlogById(req.params.id)
        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        let createdPost = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id.toString())
        let resultPost = await this.mapPostViewModel.getPostViewModel(createdPost,req.user?.id)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(resultPost)
    }

    async updateBlog(req: RequestsWithParams<URIParamsBlogIdModel>, res: Response) {
        let updateStatus: boolean = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
}

