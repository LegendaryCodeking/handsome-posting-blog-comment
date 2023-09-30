import {BlogPostFilterModel} from "../../models/FilterModel";
import {PostsWithPaginationModel} from "../../models/Posts/PostsWithPaginationModel";
import {Sort} from "mongodb";
import {FilterQuery} from "mongoose";
import {PostType} from "../../models/Posts/PostModel";
import {PostModelClass} from "../../db/db";
import {getPostViewModel} from "../../helpers/map-PostViewModel";

class PostQueryRepo {

    async findPosts(queryFilter: BlogPostFilterModel): Promise<PostsWithPaginationModel> {
        const findFilter: FilterQuery<PostType> = queryFilter.blogId === '' ? {} : {blogId: queryFilter.blogId}
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy]: queryFilter.sortDirection} : {[queryFilter.sortBy]: queryFilter.sortDirection, 'createdAt': 1})

        let foundPostsMongoose = await PostModelClass
            .find(findFilter).lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)


        let foundPosts = foundPostsMongoose.map(post => getPostViewModel(post))


        let totalCount = await PostModelClass.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundPosts
        }
    }

    async findPostsById(id: string): Promise<PostType | null> {
        let foundPost: PostType | null = await PostModelClass.findOne({"id": id})
        if (foundPost) {
            return getPostViewModel(foundPost)
        } else {
            return null
        }
    }
}

export const postQueryRepo = new PostQueryRepo()