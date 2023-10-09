import {likeStatus} from "../../enum/likeStatuses";
import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument} from "mongoose";
import {LikeModelClass} from "../../db/db";

export type likeStatusModel = likeStatus.None | likeStatus.Like | likeStatus.Dislike

export type likeInputModel = {
    likeStatus: likeStatusModel
}

export type ownerTypeModel = "Comment" | "Post"

export class likesDBModel {
    constructor(
        public _id: ObjectId,
        public ownerType: ownerTypeModel,
        public ownerId: string,
        public likesCount: number,
        public dislikesCount: number,
    ) {
    }

    static createLikesInfo(ownerId: string, ownerType: "Post" | "Comment"): HydratedDocument<likesDBModel> {
        const likesInfoInstance = new LikeModelClass()
        likesInfoInstance._id = new ObjectId()
        likesInfoInstance.ownerType = ownerType
        likesInfoInstance.ownerId = ownerId
        likesInfoInstance.likesCount = 0
        likesInfoInstance.dislikesCount = 0

        return likesInfoInstance
    }

}

export type likesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: likeStatusModel
}

export const likesMongooseSchema = new mongoose.Schema<likesDBModel>({
    _id: ObjectId,
    ownerType: {
        type: String,
        enum: ['Comment', 'Post']
    },
    ownerId: String,
    likesCount: Number,
    dislikesCount: Number
})

//////////////////////////////////
// Comments for posts collection
//////////////////////////////////

export type extendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: likeStatusModel,
    newestLikes: likeDetailsViewModel[]
}

export type likeDetailsViewModel = {
    addedAt: string,
    userId: string,
    login: string
}


//////////////////////////////////
// usersLikesConnection collection
//////////////////////////////////

export class usersLikesConnectionDBModel {
    constructor(
        public _id: ObjectId,
        public userId: string,
        public userLogin: string,
        public addedAt: Date,
        public likedObjectId: string,
        public likedObjectType: string,
        public status: likeStatusModel
    ) {
    }

}

export const userslikesconnectionMongooseSchema = new mongoose.Schema<usersLikesConnectionDBModel>({
    _id: ObjectId,
    userId: String,
    likedObjectId: String,
    userLogin: String,
    addedAt: Date,
    likedObjectType: {
        type: String,
        enum: ['Comment', 'Post']
    },
    status: {
        type: String,
        enum: [likeStatus.None, likeStatus.Like, likeStatus.Dislike]
    }
})