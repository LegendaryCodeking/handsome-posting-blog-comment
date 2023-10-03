import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogsRepo} from "../repos/blogs-repo";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {


    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepo.deleteBlog(id)
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogDbModel> {

        const createdBlog = new BlogDbModel(
            (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )

        return await this.blogsRepo.createBlog(createdBlog)

    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return this.blogsRepo.updateBlog(id, name, description, websiteUrl)
    }
}