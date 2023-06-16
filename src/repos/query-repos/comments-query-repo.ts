import {CommentDbModel, CommentsFilterModel, CommentsWithPaginationModel} from "../../models/Comments/CommentModel";
import {Filter, Sort} from "mongodb";
import {commentsCollection} from "../../db/db";
import {getCommentViewModel} from "../../helpers/map-CommentViewModel";

export const commentsQueryRepo = {
    async findComments(queryFilter: CommentsFilterModel): Promise<CommentsWithPaginationModel> {
        const findFilter: Filter<CommentDbModel> = {postId: queryFilter.postId};
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {
            [queryFilter.sortBy]: queryFilter.sortDirection,
            'createdAt': 1
        });

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
}