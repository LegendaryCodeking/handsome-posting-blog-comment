import {BlogDbModel, BlogViewModel} from "../models/BLogs/BlogModel";
import {BlogsRepo} from "../repos/blogs-repo";
import {inject, injectable} from "inversify";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";

@injectable()
export class BlogsService {


    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async deleteBlog(id: string): Promise<boolean> {
        const foundBlog = await this.blogsRepo.findBlogById(id)
        if (!foundBlog) return false
        return this.blogsRepo.deleteBlog(foundBlog)
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {

        const createdBlog = BlogDbModel.createBlog(
            name,
            description,
            websiteUrl,
        )

        await this.blogsRepo.save(createdBlog)
        return getBlogViewModel(createdBlog)

    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const foundBlog = await this.blogsRepo.findBlogById(id)
        if (!foundBlog) return false

        foundBlog.updateBlog(name,description,websiteUrl)
        await this.blogsRepo.save(foundBlog)
        return true
    }
}