import {PostsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostModel";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {likesDBModel, likesInfoViewModel, likeStatusModel,} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {LikesRepo} from "../repos/like-repo";
import {inject, injectable} from "inversify";
import {MapPostViewModel} from "../helpers/map-PostViewModel";

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepo) protected postsRepo: PostsRepo,
        @inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo,
        @inject(LikesRepo) protected likesRepo: LikesRepo,
        @inject(MapPostViewModel) protected mapPostViewModel: MapPostViewModel
    ) {
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepo.deletePost(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostDBModel> {
        const blog = await this.blogsQueryRepo.findBlogById(blogId)

        const createdPost = PostDBModel.createPost(
            title,
            shortDescription,
            content,
            blogId,
            blog!.name
        )

        const newLikesInfo = likesDBModel.createLikesInfo(createdPost._id.toString())

        await this.likesRepo.save(newLikesInfo)
        await this.postsRepo.save(createdPost)

        return createdPost

    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        const foundPost = await this.postsRepo.findPostsById(id)
        if (!foundPost) return false

        foundPost.updatePost(title, shortDescription, content, blogId)
        await this.postsRepo.save(foundPost)
        return true
    }


    //////////////////////
    // Working with likes
    //////////////////////

    async likePost(postId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string, userLogin: string): Promise<boolean> {
        const savedLikeStatus = likesInfo.myStatus
        let result: boolean = true
        if (savedLikeStatus === likeStatus.None) {
            if (newLikeStatus === likeStatus.Like) {
                result = await this.likesRepo.Like('Post', postId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.Dislike) {
                result = await this.likesRepo.Dislike('Post', postId, userId, userLogin)
            }
        }

        if (savedLikeStatus === likeStatus.Like) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Like) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Dislike) {
                await this.likesRepo.Reset('Post', postId, userId, userLogin, likeStatus.Like)
                result = await this.likesRepo.Dislike('Post', postId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Post', postId, userId, userLogin, likeStatus.Like)
            }
        }

        if (savedLikeStatus === likeStatus.Dislike) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Dislike) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Like) {
                await this.likesRepo.Reset('Post', postId, userId, userLogin, likeStatus.Dislike)
                result = await this.likesRepo.Like('Post', postId, userId, userLogin)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Post', postId, userId, userLogin, likeStatus.Dislike)
            }
        }

        return result
    }
}