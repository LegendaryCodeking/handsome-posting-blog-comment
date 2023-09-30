import {CommentDbModel, CommentsFilterModel, CommentsWithPaginationModel} from "../../models/Comments/CommentModel";
import {Sort} from "mongodb";
import {CommentModelClass} from "../../db/db";
import {getCommentViewModel} from "../../helpers/map-CommentViewModel";
import {FilterQuery} from "mongoose";
import {ObjectId} from "mongodb"

export const commentsQueryRepo = {
    async findComments(queryFilter: CommentsFilterModel): Promise<CommentsWithPaginationModel> {
        const findFilter: FilterQuery<CommentDbModel> = {postId: queryFilter.postId};
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {
            [queryFilter.sortBy]: queryFilter.sortDirection,
            'createdAt': 1
        });

        let foundCommentsMongoose = await CommentModelClass
            .find(findFilter)
            .lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)

        const foundComments = foundCommentsMongoose.map(value => getCommentViewModel(value))

        let totalCount = await CommentModelClass.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundComments
        }

    },

    async findCommentById(id: string): Promise<any> {
        // c помощью try Отлавливаем ошибку, когда в ID передается неверные данные
        // Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
        // BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
        try {
            const _id = new ObjectId(id);
            let foundComment = await CommentModelClass.findOne({"_id": _id})
            if (foundComment) {
                return getCommentViewModel(foundComment)
            } else {
                return null
            }
        } catch {
            return null
        }


    },
}