import {BlogPostFilterModel} from "../../models/FilterModel";
import {BlogsWithPaginationModel} from "../../models/BLogs/BlogsWithPaginationModel";
import {Sort} from "mongodb";
import {BlogDbModel} from "../../models/BLogs/BlogModel";
import {BlogModelClass} from "../../db/db";
import {getBlogViewModel} from "../../helpers/map-BlogViewModel";
import {PostQueryRepo} from "./post-query-repo";
import {FilterQuery} from "mongoose";

export class BlogsQueryRepo {
    private postQueryRepo: PostQueryRepo;

    constructor() {
        this.postQueryRepo = new PostQueryRepo()
    }

    async FindAllBlog(queryFilter: BlogPostFilterModel): Promise<BlogsWithPaginationModel> {

        const filter: FilterQuery<BlogDbModel> = {name: {$regex: queryFilter.searchNameTerm ?? '', $options: 'i'}}

        const sortFilter: Sort = {[queryFilter.sortBy]: queryFilter.sortDirection}

        let foundBlogsMongoose = await BlogModelClass
            .find(filter).lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)

        const foundBlogs = foundBlogsMongoose.map(blog => getBlogViewModel(blog))

        let totalCount = await BlogModelClass.countDocuments(filter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundBlogs
        }
    }

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        let foundBlog: BlogDbModel | null = await BlogModelClass.findOne({"id": id}).lean()
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    }

    async findPostsByBlogId(queryFilter: BlogPostFilterModel) {
        return this.postQueryRepo.findPosts(queryFilter)
    }
}

// Не можем пока удалить т.к. используется в MW
export const blogsQueryRepo = new BlogsQueryRepo()