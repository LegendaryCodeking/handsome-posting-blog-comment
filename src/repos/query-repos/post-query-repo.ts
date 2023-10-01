import {BlogPostFilterModel} from "../../models/FilterModel";
import {PostsWithPaginationModel} from "../../models/Posts/PostsWithPaginationModel";
import {Sort} from "mongodb";
import {FilterQuery} from "mongoose";
import {PostType} from "../../models/Posts/PostModel";
import {PostModelClass} from "../../db/db";
import {getPostViewModel} from "../../helpers/map-PostViewModel";
import {PostDBModel} from "../../models/Posts/PostDBModel";
import {PostViewModel} from "../../models/Posts/PostViewModel";

export class PostQueryRepo {

    async findPosts(queryFilter: BlogPostFilterModel, userId?: string): Promise<PostsWithPaginationModel> {
        const findFilter: FilterQuery<PostType> = queryFilter.blogId === '' ? {} : {blogId: queryFilter.blogId}
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {[queryFilter.sortBy]: queryFilter.sortDirection, 'createdAt': 1})

        let foundPostsMongoose = await PostModelClass
            .find(findFilter).lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)


        /// Код нужен чтобы не ругалось в return в Items т.к. там возвращаются Promises
        const foundPostsFunction = (postArr: PostDBModel[]) => {
            const promises = postArr.map(
                async (value) =>  await getPostViewModel(value, userId)
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

    async findPostsById(id: string): Promise<PostViewModel | null> {
        let foundPost: PostType | null = await PostModelClass.findOne({"id": id})
        if (foundPost) {
            return getPostViewModel(foundPost)
        } else {
            return null
        }
    }
}