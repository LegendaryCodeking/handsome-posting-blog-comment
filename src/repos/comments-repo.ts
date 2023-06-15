import {commentsCollection} from "./db";
import {
    CommentDbModel, CommentsFilterModel,
    CommentsWithPaginationModel,
    CommentViewModel,
    CreateCommentModel
} from "../models/CommentModel";
import {Filter, Sort} from "mongodb";


const getCommentViewModel = (comment: CommentDbModel | CreateCommentModel): CommentViewModel => {
    return {
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}


export const commentsRepo = {

    async findComments(queryFilter: CommentsFilterModel): Promise<CommentsWithPaginationModel> {
        const findFilter: Filter<CommentDbModel> = {postId: queryFilter.postId};
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy] : queryFilter.sortDirection} : {[queryFilter.sortBy] : queryFilter.sortDirection, 'createdAt': 1});

        let foundComments = await commentsCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(value => getCommentViewModel(value)).toArray();

        let totalCount = await commentsCollection.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundComments
        }
        
    },

    async findCommentById(id: string): Promise<any> {
        let foundComment = await commentsCollection.findOne({"id": id})
        if (foundComment) {
            return getCommentViewModel(foundComment)
        } else {
            return null
        }

    },
    async updateComment(id: string, content: string): Promise<boolean> {
        let result = await commentsCollection.updateOne({"id": id}, {
            $set: {
                "content": content
            }
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        let result = await commentsCollection.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createComment(newComment: CreateCommentModel ): Promise<CommentViewModel> {
        await commentsCollection.insertOne(newComment)
        return getCommentViewModel(newComment);
    }
}