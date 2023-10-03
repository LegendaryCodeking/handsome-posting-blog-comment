import {PostsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostDBModel";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {
    likesDBModel,
    likesInfoViewModel,
    likeStatusModel,
} from "../models/Comments/LikeModel";
import {ObjectId} from "mongodb";
import {likeStatus} from "../enum/likeStatuses";
import {LikesRepo} from "../repos/like-repo";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepo) protected postsRepo: PostsRepo,
        @inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo,
        @inject(LikesRepo) protected likesRepo: LikesRepo
    ) {
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepo.deletePost(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string, userId?: string, userLogin?: string): Promise<PostDBModel> {
        const blogName = await this.blogsQueryRepo.findBlogById(blogId)

        const createdPost = new PostDBModel(
            (+(new Date())).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName!.name,
            new Date().toISOString()
        )

        const newLikesInfo = new likesDBModel(
            new ObjectId(),
            "Post",
            createdPost.id,
            0,
            0
        )

        return await this.postsRepo.createPost(createdPost, newLikesInfo)
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsRepo.updatePost(id, title, shortDescription, content, blogId)
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