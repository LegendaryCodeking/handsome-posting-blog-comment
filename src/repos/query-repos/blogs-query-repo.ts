import {BlogPostFilterModel} from "../../models/FilterModel";
import {BlogsWithPaginationModel} from "../../models/BlogsWithPaginationModel";
import {Filter, Sort} from "mongodb";
import {BlogType} from "../../models/BlogModel";
import {blogsCollection} from "../../db/db";
import {getBlogViewModel} from "../../helpers/map-BlogViewModel";
import {postQueryRepo} from "./post-query-repo";

export const blogsQueryRepo = {
    async FindAllBlog(queryFilter: BlogPostFilterModel): Promise<BlogsWithPaginationModel> {

        const filter: Filter<BlogType> = {name: {$regex: queryFilter.searchNameTerm ?? '', $options: 'i'}}

        const sortFilter: Sort = {[queryFilter.sortBy] : queryFilter.sortDirection}

        let foundBlogs =  await blogsCollection
            .find(filter)
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(blog => getBlogViewModel(blog)).toArray();

        let totalCount = await blogsCollection.countDocuments(filter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundBlogs
        }
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        let foundBlog: BlogType | null = await blogsCollection.findOne({"id": id})
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    },
    async findPostsByBlogId(queryFilter: BlogPostFilterModel) {
        return postQueryRepo.findPosts(queryFilter)
    }
}