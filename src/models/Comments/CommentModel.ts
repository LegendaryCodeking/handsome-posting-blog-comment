import {ObjectId} from "mongodb";

export type CreateCommentModel = {
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

export type CommentsWithPaginationModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": CommentViewModel[]
}