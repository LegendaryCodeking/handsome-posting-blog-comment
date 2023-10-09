import {CommentModelClass, LikeModelClass} from "../db/db";
import {CommentDbModel, CommentViewModel} from "../models/Comments/CommentModel";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {likesDBModel} from "../models/Comments/LikeModel";
import {inject, injectable} from "inversify";
import {MapCommentViewModel} from "../helpers/map-CommentViewModel";

@injectable()
export class CommentsRepo {
    constructor(
        @inject(MapCommentViewModel) protected mapCommentViewModel: MapCommentViewModel
    ) {
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await CommentModelClass.updateOne({"id": id}, {
        //     $set: {
        //         "content": content
        //     }
        // })
        // return result.matchedCount === 1
        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()

        return true
    }

    async deleteComment(id: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await CommentModelClass.deleteOne({"id": id})
        // return result.deletedCount === 1

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const commentInstance = await CommentModelClass.findOne({"_id": _id})
        if (!commentInstance) return false

        await commentInstance.deleteOne()

        return true
    }

    async createComment(
        newComment: CommentDbModel,
        userId: string,
        newLikesInfo: likesDBModel): Promise<CommentViewModel> {


        const commentInstance = new CommentModelClass()
        commentInstance._id = newComment._id
        commentInstance.postId = newComment.postId
        commentInstance.content = newComment.content
        commentInstance.commentatorInfo = newComment.commentatorInfo
        commentInstance.createdAt = newComment.createdAt
        await commentInstance.save();


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


        return this.mapCommentViewModel.getCommentViewModel(newComment, userId);
    }
}