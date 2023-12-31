import {CommentDbModel, CommentsFilterModel, CommentsWithPaginationModel} from "../../models/Comments/CommentModel";
import {Sort} from "mongodb";
import {CommentModelClass} from "../../db/db";
import {FilterQuery} from "mongoose";
import {createObjectIdFromSting} from "../../helpers/map-ObjectId";
import {inject, injectable} from "inversify";
import {MapCommentViewModel} from "../../helpers/map-CommentViewModel";


@injectable()
export class CommentsQueryRepo {

    constructor(
        @inject(MapCommentViewModel) protected mapCommentViewModel: MapCommentViewModel
    ) {
    }

    async findComments(queryFilter: CommentsFilterModel, userId?: string | undefined): Promise<CommentsWithPaginationModel> {
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


        /// Код нужен чтобы не ругалось в return в Items т.к. там возвращаются Promises
        const foundCommentsFunction = (commArr: CommentDbModel[]) => {
            const promises = commArr.map(
              async (value) =>  await this.mapCommentViewModel.getCommentViewModel(value, userId)
            );
            return Promise.all(promises);
        }

        const foundComments = await foundCommentsFunction(foundCommentsMongoose)


        let totalCount = await CommentModelClass.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundComments
        }

    }

    async findCommentById(id: string, userId?: string | undefined): Promise<any> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        let foundComment = await CommentModelClass.findOne({"_id": _id})
        if (foundComment) {
            return this.mapCommentViewModel.getCommentViewModel(foundComment, userId)
        } else {
            return null
        }
    }
}