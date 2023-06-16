import {PostsWithPaginationModel} from "../models/PostsWithPaginationModel";
import {queryBlogPostPagination, queryCommentswithPaination} from "../models/FilterModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../routes/http-statuses-const";
import {postsService} from "../domain/posts-service";
import {RequestWithParams} from "../types/posts-types";
import {URIParamsPostIdModel} from "../models/URIParamsPostIdModel";
import {PostViewModel} from "../models/PostViewModel";
import {CommentsWithPaginationModel, CommentViewModel} from "../models/CommentModel";
import {commentService} from "../domain/comment-service";

export const postsController = {

    async findAllPosts(req: Request,
                       res: Response<PostsWithPaginationModel>) {
        const queryFilter = queryBlogPostPagination(req)

        let foundPosts = await postsService.findPosts(queryFilter);
        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)
    },

    async findPostById(req: RequestWithParams<URIParamsPostIdModel>,
                       res: Response) {
        const foundPost = await postsService.findProductById(req.params.id);

        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        res.json(foundPost)
    },

    async deletePost(req: RequestWithParams<URIParamsPostIdModel>,
                     res: Response) {
        const deletionStatus = await postsService.deletePost(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    },

    async createPost(req: Request,
                     res: Response<PostViewModel>) {
        let createdPost = await postsService
            .createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    },

    async updatePost(req: RequestWithParams<URIParamsPostIdModel>,
                     res: Response) {
        let updateStatus = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    },
    ////////////////////////////
    // working with comments
    ////////////////////////////

    async createCommentForPost(req: Request,
                               res: Response<CommentViewModel>) {
        // Проверяем, что пост существует
        const foundPost = await postsService.findProductById(req.params.postId);

        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        let createComment = await commentService.createComment(req.params.postId, req.body.content, req.user!.id, req.user!.login)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createComment)

    },

    async getCommentsForPost(req: Request,
                             res: Response<CommentsWithPaginationModel>) {

        const queryFilter = queryCommentswithPaination(req)

        let foundPosts = await commentService.findComments(queryFilter);
        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)

    }


}