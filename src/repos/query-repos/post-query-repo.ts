import {BlogPostFilterModel} from "../../models/FilterModel";
import {PostDBModel,PostViewModel, PostsWithPaginationModel} from "../../models/Posts/PostModel";
import {Sort} from "mongodb";
import {FilterQuery} from "mongoose";
import {PostModelClass} from "../../db/db";
import {inject, injectable} from "inversify";
import {MapPostViewModel} from "../../helpers/map-PostViewModel";
import "reflect-metadata";
import {createObjectIdFromSting} from "../../helpers/map-ObjectId";


@injectable()
export class PostQueryRepo {

    constructor(@inject(MapPostViewModel) protected mapPostViewModel: MapPostViewModel) {
    }

    async findPosts(queryFilter: BlogPostFilterModel, userId?: string): Promise<PostsWithPaginationModel> {
        const findFilter: FilterQuery<PostDBModel> = queryFilter.blogId === '' ? {} : {blogId: queryFilter.blogId}
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {
            [queryFilter.sortBy]: queryFilter.sortDirection,
            'createdAt': 1
        })

        let foundPostsMongoose = await PostModelClass
            .find(findFilter).lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)


        /// Код нужен чтобы не ругалось в return в Items т.к. там возвращаются Promises
        const foundPostsFunction = (postArr: PostDBModel[]) => {
            const promises = postArr.map(
                async (value) => await this.mapPostViewModel.getPostViewModel(value, userId)
            );
            return Promise.all(promises);
        }

        const foundPosts = await foundPostsFunction(foundPostsMongoose)


        let totalCount = await PostModelClass.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundPosts
        }
    }

    async findPostsById(id: string, userId?: string): Promise<PostViewModel | null> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundPost: PostDBModel | null = await PostModelClass.findOne({"_id": _id})
        if (foundPost) {
            return this.mapPostViewModel.getPostViewModel(foundPost, userId)
        } else {
            return null
        }
    }
}