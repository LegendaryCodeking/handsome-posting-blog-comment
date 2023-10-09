import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument, Model} from "mongoose";
import {WithPagination} from "../custom";
import {likesInfoViewModel} from "./LikeModel";
import {CommentModelClass} from "../../db/db";

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

    static createComment(postId: string, content: string, userId: string, userLogin: string): HydratedDocument<CommentDbModel> {
        const commentInstance = new CommentModelClass()
        commentInstance._id = new ObjectId()
        commentInstance.postId = postId
        commentInstance.content = content
        commentInstance.commentatorInfo.userId = userId
        commentInstance.commentatorInfo.userLogin = userLogin
        commentInstance.createdAt = new Date().toISOString()
        return commentInstance
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

export type commentDBMethodsType = {
    updateComment: () => void
}

export type commentModelType = Model<CommentDbModel,{},commentDBMethodsType>



export const commentMongooseSchema = new mongoose.Schema<CommentDbModel,commentModelType,commentDBMethodsType>({
    _id: ObjectId,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})