import {likeStatus} from "../../enum/likeStatuses";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export type likeStatusModel = likeStatus.None | likeStatus.Like | likeStatus.Dislike

export type likeInputModel = {
    likeStatus: likeStatusModel
}

export type likesDBModel = {
    _id: ObjectId
    ownerType: "Comment" | "Post"
    ownerId: string
    likesCount: number
    dislikesCount: number
    usersActions: {
        userid: string,
        status: likeStatusModel
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
    dislikesCount: Number,
    usersActions: {
        userid: String,
        status: {
            type: String,
            enum: [likeStatus.None, likeStatus.Like, likeStatus.Dislike]
        }
    }
})

