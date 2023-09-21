import {CommentDbModel, CommentsFilterModel, CommentsWithPaginationModel} from "../../models/Comments/CommentModel";
import {Sort} from "mongodb";
import {CommentModel} from "../../db/db";
import {getCommentViewModel} from "../../helpers/map-CommentViewModel";
import {FilterQuery} from "mongoose";

export const commentsQueryRepo = {
    async findComments(queryFilter: CommentsFilterModel): Promise<CommentsWithPaginationModel> {
        const findFilter: FilterQuery<CommentDbModel> = {postId: queryFilter.postId};
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {
            [queryFilter.sortBy]: queryFilter.sortDirection,
            'createdAt': 1
        });

        let foundCommentsMongoose = await CommentModel
            .find(findFilter)
            .lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)

        const foundComments = foundCommentsMongoose.map(value => getCommentViewModel(value))

        let totalCount = await CommentModel.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundComments
        }

    },

    async findCommentById(id: string): Promise<any> {
        let foundComment = await CommentModel.findOne({"id": id})
        if (foundComment) {
            return getCommentViewModel(foundComment)
        } else {
            return null
        }

    },
}