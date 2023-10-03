import {LikeModelClass, UsersLikesConnectionModelClass} from "../db/db";
import {ownerTypeModel} from "../models/Comments/LikeModel";
import {likeStatus} from "../enum/likeStatuses";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class LikesRepo {
    async Like(
        ownerType: ownerTypeModel,
        ownerId: string,
        userId: string,
        userLogin: string
    ): Promise<boolean> {

        let likesIfoInstance = await LikeModelClass.findOne(
            {
                "ownerType": ownerType,
                "ownerId": ownerId
            })
        if (!likesIfoInstance) return false

        likesIfoInstance.likesCount += 1

        await likesIfoInstance.save()

        let userStatusInstance = await UsersLikesConnectionModelClass.findOne(
            {
                "userId": userId,
                "likedObjectId": ownerId,
                "likedObjectType": ownerType
            })

        if (!userStatusInstance) {
            userStatusInstance = new UsersLikesConnectionModelClass()
            userStatusInstance._id = new ObjectId()
            userStatusInstance.userId = userId
            userStatusInstance.likedObjectId = ownerId
            userStatusInstance.likedObjectType = ownerType
            userStatusInstance.userLogin = userLogin
            userStatusInstance.addedAt = new Date()
        }

        userStatusInstance.status = likeStatus.Like

        await userStatusInstance.save()

        return true

    }

    async Dislike(
        ownerType: ownerTypeModel,
        ownerId: string,
        userId: string,
        userLogin: string
    ): Promise<boolean> {

        let likesIfoInstance = await LikeModelClass.findOne(
            {
                "ownerType": ownerType,
                "ownerId": ownerId
            })
        if (!likesIfoInstance) return false

        likesIfoInstance.dislikesCount += 1

        await likesIfoInstance.save()

        let userStatusInstance = await UsersLikesConnectionModelClass.findOne(
            {
                "userId": userId,
                "likedObjectId": ownerId,
                "likedObjectType": ownerType
            })

        if (!userStatusInstance) {
            userStatusInstance = new UsersLikesConnectionModelClass()
            userStatusInstance._id = new ObjectId()
            userStatusInstance.userId = userId
            userStatusInstance.likedObjectId = ownerId
            userStatusInstance.likedObjectType = ownerType
            userStatusInstance.userLogin = userLogin
            userStatusInstance.addedAt = new Date()
        }
        userStatusInstance.status = likeStatus.Dislike

        await userStatusInstance.save()

        return true

    }

    async Reset(
        ownerType: ownerTypeModel,
        ownerId: string,
        userId: string,
        userLogin: string,
        savedStatus: string,
    ): Promise<boolean> {

        let likesIfoInstance = await LikeModelClass.findOne(
            {
                "ownerType": ownerType,
                "ownerId": ownerId
            })
        if (!likesIfoInstance) return false

        if(savedStatus === likeStatus.Like) {
            likesIfoInstance.likesCount -= 1
        }
        if(savedStatus === likeStatus.Dislike) {
            likesIfoInstance.dislikesCount -= 1
        }

        await likesIfoInstance.save()

        let userStatusInstance = await UsersLikesConnectionModelClass.findOne(
            {
                "userId": userId,
                "likedObjectId": ownerId,
                "likedObjectType": ownerType
            })

        if (!userStatusInstance) {
            userStatusInstance = new UsersLikesConnectionModelClass()
            userStatusInstance._id = new ObjectId()
            userStatusInstance.userId = userId
            userStatusInstance.likedObjectId = ownerId
            userStatusInstance.likedObjectType = ownerType
            userStatusInstance.userLogin = userLogin
            userStatusInstance.addedAt = new Date()
        }
        userStatusInstance.status = likeStatus.None

        await userStatusInstance.save()

        return true

    }

}