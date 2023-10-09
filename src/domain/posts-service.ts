import {PostsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostModel";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {likesDBModel, likesInfoViewModel, likeStatusModel,} from "../models/Comments/LikeModel";
import {LikesRepo} from "../repos/like-repo";
import {inject, injectable} from "inversify";
import {MapPostViewModel} from "../helpers/map-PostViewModel";
import {LikeService} from "./like-service";

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepo) protected postsRepo: PostsRepo,
        @inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo,
        @inject(LikesRepo) protected likesRepo: LikesRepo,
        @inject(MapPostViewModel) protected mapPostViewModel: MapPostViewModel,
        @inject(LikeService) protected likesService: LikeService
    ) {
    }

    async deletePost(id: string): Promise<boolean> {
        const foundPost = await this.postsRepo.findPostsById(id)
        if (!foundPost) return false

        return this.postsRepo.deletePost(foundPost)
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

        const newLikesInfo = likesDBModel.createLikesInfo(createdPost._id.toString(), "Post")

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
        return await this.likesService.likeEntity("Post", postId, likesInfo, newLikeStatus, userId, userLogin)
    }
}