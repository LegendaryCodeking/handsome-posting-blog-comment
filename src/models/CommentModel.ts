import {ObjectId} from "mongodb";

export type CreateCommentModel = {
    id: string
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
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
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
}


export type CommentatorInfoType = {
    userId: string
    userLogin: string
}