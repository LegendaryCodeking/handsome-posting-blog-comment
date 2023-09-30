import {postsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostDBModel";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";

class PostsService {
    private blogsQueryRepo: BlogsQueryRepo;

    constructor() {
        this.blogsQueryRepo = new BlogsQueryRepo
    }

    async deletePost(id: string): Promise<boolean> {
        return postsRepo.deletePost(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostDBModel> {
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

        return await postsRepo.createPost(createdPost)
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepo.updatePost(id, title, shortDescription, content, blogId)
    }
}

export const postsService = new PostsService()