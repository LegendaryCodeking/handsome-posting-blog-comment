import {likeStatus} from "../../enum/likeStatuses";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

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
// usersLikesConnection collection
//////////////////////////////////

export class usersLikesConnectionDBModel {
    constructor(
        public _id: ObjectId,
        public userId: string,
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
    likedObjectType: {
        type: String,
        enum: ['Comment', 'Post']
    },
    status: {
        type: String,
        enum: [likeStatus.None, likeStatus.Like, likeStatus.Dislike]
    }
})