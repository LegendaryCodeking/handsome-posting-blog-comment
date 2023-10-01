import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {WithPagination} from "../custom";
import {likesInfoViewModel} from "./LikeModel";

export type CreateCommentModel = {
    content: string
}

export type UpdateCommentModel = {
    content: string
}

export class CommentDbModel {
constructor(
    public _id: ObjectId,
    public postId: string,
    public content: string,
    public commentatorInfo: CommentatorInfoType,
    public createdAt: string
) {
}
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string,
    likesInfo: likesInfoViewModel
}

export type CommentsFilterModel = {
    postId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
}


export type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type CommentsWithPaginationModel = WithPagination<CommentViewModel>

export const commentMongooseSchema = new mongoose.Schema<CommentDbModel>({
    _id: ObjectId,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})