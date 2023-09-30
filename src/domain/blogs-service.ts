import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogsRepo} from "../repos/blogs-repo";

export class BlogsService {
    blogsRepo: BlogsRepo

    constructor() {
        this.blogsRepo = new BlogsRepo()
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