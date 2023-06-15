import {CommentsFilterModel} from "./CommentModel";

export type BlogPostFilterModel = {
    searchNameTerm: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    blogId: string
    searchLoginTerm: string
    searchEmailTerm: string
}


export const queryBlogPostPagination = (req: any): BlogPostFilterModel => {

    return {
        searchNameTerm: req.query.searchNameTerm ?? '',
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc': 'desc',
        pageNumber: +(req.query.pageNumber ?? 1),
        pageSize: +(req.query.pageSize ?? 10),
        blogId: req.params.id ?? '',
        searchLoginTerm: req.query.searchLoginTerm ?? '',
        searchEmailTerm: req.query.searchEmailTerm ?? ''
    }
}


export const queryCommentswithPaination = (req: any) : CommentsFilterModel => {
    return {
        postId: req.params.postId,
        sortBy:  req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc': 'desc',
        pageNumber: +(req.query.pageNumber ?? 1),
        pageSize: +(req.query.pageSize ?? 10)
    }
}