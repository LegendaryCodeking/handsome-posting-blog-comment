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

export type CommentsFilterModel = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
}


export type CommentatorInfoType = {
    userId: string
    userLogin: string
}