import {PostType} from "../models/PostModel";
import {postsRepo} from "../repos/posts-repo";
import {PostFilterModel} from "../models/PostFilterModel";
import {PostsWithPaginationModel} from "../models/PostsWithPaginationModel";

export const postsService = {
    async findPosts(queryFilter: PostFilterModel): Promise<PostsWithPaginationModel> {
        return postsRepo.findPosts(queryFilter)
    },
    async findProductById(id: string): Promise<PostType | null> {
        return postsRepo.findPostsById(id)
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepo.deletePost(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType> {
        const createdPost = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": "BlogName",
            "createdAt": new Date().toISOString()

        };

        return await postsRepo.createPost(createdPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepo.updatePost(id,title,shortDescription,content,blogId)
    },
    async deleteAll() {
        await postsRepo.deleteAll()
    }
}