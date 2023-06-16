import {BlogPostFilterModel} from "../../models/FilterModel";
import {PostsWithPaginationModel} from "../../models/Posts/PostsWithPaginationModel";
import {Filter, Sort} from "mongodb";
import {PostType} from "../../models/Posts/PostModel";
import {postsCollection} from "../../db/db";
import {getPostViewModel} from "../../helpers/map-PostViewModel";

export const postQueryRepo = {
    async findPosts(queryFilter: BlogPostFilterModel): Promise<PostsWithPaginationModel> {
        const findFilter: Filter<PostType> = queryFilter.blogId === '' ? {} : {blogId: queryFilter.blogId}
        const sortFilter: Sort = (queryFilter.sortBy === 'createdAt' ? {[queryFilter.sortBy] : queryFilter.sortDirection} : {[queryFilter.sortBy] : queryFilter.sortDirection, 'createdAt': 1})

        let foundPosts = await postsCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(post => getPostViewModel(post)).toArray();


        let totalCount = await postsCollection.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundPosts
        }
    },
    async findPostsById(id: string): Promise<PostType | null> {
        let foundPost: PostType | null = await postsCollection.findOne({"id": id})
        if (foundPost) {
            return getPostViewModel(foundPost)
        } else {
            return null
        }
    }
}
