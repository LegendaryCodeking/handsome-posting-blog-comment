import {PostsWithPaginationModel} from "../models/Posts/PostsWithPaginationModel";
import {queryBlogPostPagination, queryCommentsWithPagination} from "../models/FilterModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostsService} from "../domain/posts-service";
import {URIParamsPostIdModel} from "../models/Posts/URIParamsPostIdModel";
import {PostViewModel} from "../models/Posts/PostViewModel";
import {CommentsWithPaginationModel, CommentViewModel} from "../models/Comments/CommentModel";
import {CommentService} from "../domain/comment-service";
import {PostQueryRepo} from "../repos/query-repos/post-query-repo";
import {CommentsQueryRepo} from "../repos/query-repos/comments-query-repo";
import {RequestsWithParams} from "../models/requestModels";
import {LikesQueryRepo} from "../repos/query-repos/likes-query-repo";
import {likesInfoViewModel} from "../models/Comments/LikeModel";
import {inject, injectable} from "inversify";
import {MapPostViewModel} from "../helpers/map-PostViewModel";

@injectable()
export class PostsController {

    constructor(
        @inject(PostQueryRepo) protected postQueryRepo: PostQueryRepo,
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsQueryRepo) protected commentsQueryRepo: CommentsQueryRepo,
        @inject(CommentService) protected commentService: CommentService,
        @inject(LikesQueryRepo) protected likesQueryRepo: LikesQueryRepo,
        @inject(MapPostViewModel) protected mapPostViewModel: MapPostViewModel
    ) {

    }

    async findAllPosts(req: Request,
                       res: Response<PostsWithPaginationModel>) {
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

    async findPostById(req: RequestsWithParams<URIParamsPostIdModel>,
                       res: Response) {
        const foundPost = await this.postQueryRepo.findPostsById(req.params.id, req.user?.id);

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
            .createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.user?.id, req.user?.login)

        const resultPost = await this.mapPostViewModel.getPostViewModel(createdPost)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(resultPost)
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

        let createComment = await this.commentService.createComment(req.params.postId, req.body.content, req.user!.id, req.user!.login)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createComment)

    }

    async getCommentsForPost(req: Request,
                             res: Response<CommentsWithPaginationModel>) {

        const queryFilter = queryCommentsWithPagination(req)

        let foundPosts = await this.commentsQueryRepo.findComments(queryFilter, req.user?.id);
        if (!foundPosts.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundPosts);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundPosts)

    }

    ////////////////////////////
    // working with likes
    ////////////////////////////

    async sendLikeStatus(req: Request, res: Response) {

        let foundPost: PostViewModel | null = await this.postQueryRepo.findPostsById(req.params.id)
        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        const likesInfo: likesInfoViewModel | null =
            await this.likesQueryRepo.findLikesByOwnerId('Post', req.params.id, req.user!.id)
        if (!likesInfo) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500)
                .json({errorsMessage: "Sorry. Unable to get likes info from DB"})
            return;
        }

        let likeOperationStatus: boolean = await this.postsService.likePost(req.params.id, likesInfo, req.body.likeStatus, req.user!.id, req.user!.login)
        if (!likeOperationStatus) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500)
                .json({errorsMessage: "Something went wrong during like operation"})
            return;
        }

        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
}
