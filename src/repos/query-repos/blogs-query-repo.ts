import {BlogPostFilterModel} from "../../models/FilterModel";
import {Sort} from "mongodb";
import {BlogDbModel, BlogsWithPaginationModel, BlogViewModel} from "../../models/BLogs/BlogModel";
import {BlogModelClass} from "../../db/db";
import {getBlogViewModel} from "../../helpers/map-BlogViewModel";
import {FilterQuery} from "mongoose";
import {injectable} from "inversify";
import {createObjectIdFromSting} from "../../helpers/map-ObjectId";

@injectable()
export class BlogsQueryRepo {

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

    async findBlogById(id: string): Promise<BlogViewModel | null> {

        const _id = createObjectIdFromSting(id)
        if (_id === null) return null
        let foundBlog: BlogDbModel | null = await BlogModelClass.findOne({"_id": _id}).lean()
        if (foundBlog) {
            return getBlogViewModel(foundBlog)
        } else {
            return null
        }
    }
}