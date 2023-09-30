import {PostsWithPaginationModel} from "../models/Posts/PostsWithPaginationModel";
import {queryBlogPostPagination, queryCommentsWithPagination} from "../models/FilterModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostsService} from "../domain/posts-service";
import {URIParamsPostIdModel} from "../models/Posts/URIParamsPostIdModel";
import {PostViewModel} from "../models/Posts/PostViewModel";
import {CommentsWithPaginationModel, CommentViewModel} from "../models/Comments/CommentModel";
import {commentService} from "../domain/comment-service";
import {PostQueryRepo} from "../repos/query-repos/post-query-repo";
import {commentsQueryRepo} from "../repos/query-repos/comments-query-repo";
import {RequestsWithParams} from "../models/requestModels";
import {getPostViewModel} from "../helpers/map-PostViewModel";

class PostsController {
    private postQueryRepo: PostQueryRepo;
    private postsService: PostsService;

    constructor() {
        this.postsService = new PostsService
        this.postQueryRepo = new PostQueryRepo
    }

    async findAllPosts(req: Request,
                       res: Response<PostsWithPaginationModel>) {
        const queryFilter = queryBlogPostPagination(req)

        let foundPosts = await this.postQueryRepo.findPosts(queryFilter);
        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)
    }

    async findPostById(req: RequestsWithParams<URIParamsPostIdModel>,
                       res: Response) {
        const foundPost = await this.postQueryRepo.findPostsById(req.params.id);

        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        res.json(foundPost)
    }

    async deletePost(req: RequestsWithParams<URIParamsPostIdModel>,
                     res: Response) {
        const deletionStatus = await this.postsService.deletePost(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

    async createPost(req: Request,
                     res: Response<PostViewModel>) {
        let createdPost = await this.postsService
            .createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(getPostViewModel(createdPost))
    }

    async updatePost(req: RequestsWithParams<URIParamsPostIdModel>,
                     res: Response) {
        let updateStatus = await this.postsService
            .updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

    ////////////////////////////
    // working with comments
    ////////////////////////////

    async createCommentForPost(req: Request,
                               res: Response<CommentViewModel>) {
        // Проверяем, что пост существует
        const foundPost = await this.postQueryRepo.findPostsById(req.params.postId);

        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        let createComment = await commentService.createComment(req.params.postId, req.body.content, req.user!.id, req.user!.login)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createComment)

    }

    async getCommentsForPost(req: Request,
                             res: Response<CommentsWithPaginationModel>) {

        const queryFilter = queryCommentsWithPagination(req)

        let foundPosts = await commentsQueryRepo.findComments(queryFilter);
        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)

    }
}

export const postsController = new PostsController()