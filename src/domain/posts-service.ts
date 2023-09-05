import {PostType} from "../models/Posts/PostModel";
import {postsRepo} from "../repos/posts-repo";
import {PostDBModel} from "../models/Posts/PostDBModel";

export const postsService = {
    async deletePost(id: string): Promise<boolean> {
        return postsRepo.deletePost(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType> {
        const createdPost: PostDBModel = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": "BlogName",
            "createdAt": new Date().toISOString(),
            "comments": []

        };

        return await postsRepo.createPost(createdPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepo.updatePost(id,title,shortDescription,content,blogId)
    }
}