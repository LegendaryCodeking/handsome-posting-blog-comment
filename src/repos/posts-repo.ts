import {PostType} from "../models/Posts/PostModel";
import {PostModelClass} from "../db/db";
import {getPostViewModel} from "../helpers/map-PostViewModel";

export const postsRepo = {
    async deletePost(id: string): Promise<boolean> {
        let result = await PostModelClass.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createPost(createdPost: PostType): Promise<PostType> {

        await PostModelClass.insertMany([createdPost]);
        return getPostViewModel(createdPost);
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        let result = await PostModelClass.updateOne({"id": id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId
            }
        })
        return result.matchedCount === 1
    }
}