import {PostModelClass} from "../db/db";
import {PostDBModel} from "../models/Posts/PostDBModel";

export class PostsRepo {
    async deletePost(id: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await PostModelClass.deleteOne({"id": id})
        // return result.deletedCount === 1

        const postInstance = await PostModelClass.findOne({"id": id})
        if (!postInstance) return false

        await postInstance.deleteOne()

        return true
    }

    async createPost(createdPost: PostDBModel): Promise<PostDBModel> {
        // Mongo native driver code
        // await PostModelClass.insertMany([createdPost]);
        // return getPostViewModel(createdPost);

        const postInstance = new PostModelClass()

        postInstance.id = createdPost.id
        postInstance.title = createdPost.title
        postInstance.shortDescription = createdPost.shortDescription
        postInstance.content = createdPost.content
        postInstance.blogId = createdPost.blogId
        postInstance.blogName = createdPost.blogName
        postInstance.createdAt = createdPost.createdAt
        postInstance.comments = createdPost.comments

        await postInstance.save()

        return createdPost
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await PostModelClass.updateOne({"id": id}, {
        //     $set: {
        //         title: title,
        //         shortDescription: shortDescription,
        //         content: content,
        //         blogId: blogId
        //     }
        // })
        // return result.matchedCount === 1

        const postInstance = await PostModelClass.findOne({"id": id})
        if (!postInstance) return false

        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.blogId = blogId

        await postInstance.save()

        return true
    }
}