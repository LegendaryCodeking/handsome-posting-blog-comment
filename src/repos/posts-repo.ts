import {LikeModelClass, PostModelClass, UsersLikesConnectionModelClass} from "../db/db";
import {PostDBModel} from "../models/Posts/PostDBModel";
import {likesDBModel, usersLikesConnectionDBModel} from "../models/Comments/LikeModel";

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

    async createPost(
        createdPost: PostDBModel,
        newLikesInfo: likesDBModel,
        newUsersLikesConnectionInfo?: usersLikesConnectionDBModel): Promise<PostDBModel> {

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

        const likesInfoInstance = new LikeModelClass()
        likesInfoInstance._id = newLikesInfo._id
        likesInfoInstance.ownerType = newLikesInfo.ownerType
        likesInfoInstance.ownerId = newLikesInfo.ownerId
        likesInfoInstance.likesCount = newLikesInfo.likesCount
        likesInfoInstance.dislikesCount = newLikesInfo.dislikesCount
        await likesInfoInstance.save();

        // const usersLikesConnectionInfoInstance = new UsersLikesConnectionModelClass()
        // usersLikesConnectionInfoInstance._id = newUsersLikesConnectionInfo._id
        // usersLikesConnectionInfoInstance.userId = newUsersLikesConnectionInfo.userId
        // usersLikesConnectionInfoInstance.likedObjectId = newUsersLikesConnectionInfo.likedObjectId
        // usersLikesConnectionInfoInstance.likedObjectType = newUsersLikesConnectionInfo.likedObjectType
        // usersLikesConnectionInfoInstance.status = newUsersLikesConnectionInfo.status
        // usersLikesConnectionInfoInstance.userLogin = newUsersLikesConnectionInfo.userLogin
        // usersLikesConnectionInfoInstance.addedAt = newUsersLikesConnectionInfo.addedAt
        // await usersLikesConnectionInfoInstance.save();

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