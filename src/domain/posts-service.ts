import {PostsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostDBModel";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {
    likesDBModel,
    likesInfoViewModel,
    likeStatusModel,
    usersLikesConnectionDBModel
} from "../models/Comments/LikeModel";
import {ObjectId} from "mongodb";
import {likeStatus} from "../enum/likeStatuses";
import {LikesRepo} from "../repos/like-repo";

export class PostsService {

    constructor(
        protected postsRepo: PostsRepo,
        protected blogsQueryRepo: BlogsQueryRepo,
        protected likesRepo: LikesRepo
    ) {
    }

    async deletePost(id: string): Promise<boolean> {
        return this.postsRepo.deletePost(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string, userId: string, userLogin: string): Promise<PostDBModel> {
        const blogName = await this.blogsQueryRepo.findBlogById(blogId)

        const createdPost = new PostDBModel(
            (+(new Date())).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName!.name,
            new Date().toISOString(),
            []
        )

        const newLikesInfo = new likesDBModel(
            new ObjectId(),
            "Comment",
            createdPost.id,
            0,
            0
        )

        const newUsersLikesConnectionInfo = new usersLikesConnectionDBModel(
            new ObjectId(),
            userId,
            userLogin,
            new Date(),
            createdPost.id,
            "Comment",
            likeStatus.None
        )

        return await this.postsRepo.createPost(createdPost,newLikesInfo,newUsersLikesConnectionInfo)
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsRepo.updatePost(id, title, shortDescription, content, blogId)
    }


    //////////////////////
    // Working with likes
    //////////////////////

    async likePost(commentId: string, likesInfo: likesInfoViewModel, newLikeStatus: likeStatusModel, userId: string): Promise<boolean> {
        const savedLikeStatus = likesInfo.myStatus
        let result: boolean = true
        if (savedLikeStatus === likeStatus.None) {
            if (newLikeStatus === likeStatus.Like) {
                result = await this.likesRepo.Like('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.Dislike) {
                result = await this.likesRepo.Dislike('Comment', commentId, userId)
            }
        }

        if (savedLikeStatus === likeStatus.Like) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Like) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Dislike) {
                await this.likesRepo.Reset('Comment', commentId, userId, likeStatus.Like)
                result = await this.likesRepo.Dislike('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Comment', commentId, userId, likeStatus.Like)
            }
        }

        if (savedLikeStatus === likeStatus.Dislike) {
            // По условию домашки, при повторной отправке того-же статуса ничего не меняется
            // if(newLikeStatus === likeStatus.Dislike) {
            //     await likesRepo.Reset('Comment', req.params.id, req.user!.id,likeStatus.Like)
            // }
            if (newLikeStatus === likeStatus.Like) {
                await this.likesRepo.Reset('Comment', commentId, userId, likeStatus.Dislike)
                result = await this.likesRepo.Like('Comment', commentId, userId)
            }
            if (newLikeStatus === likeStatus.None) {
                result = await this.likesRepo.Reset('Comment', commentId, userId, likeStatus.Dislike)
            }
        }

        return result
    }
}