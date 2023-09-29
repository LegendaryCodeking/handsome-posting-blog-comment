import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {WithPagination} from "../custom";

export type CreateCommentModel = {
    content: string
}

export type UpdateCommentModel = {
    content: string
}

export type CommentDbModel = {
    _id?: ObjectId
    id: string,
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
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
    id: String,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})