import {BlogDbModel, BlogViewModel} from "../models/BLogs/BlogModel";
import {BlogsRepo} from "../repos/blogs-repo";
import {inject, injectable} from "inversify";
import {getBlogViewModel} from "../helpers/map-BlogViewModel";

@injectable()
export class BlogsService {


    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepo.deleteBlog(id)
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
        //findById
        //blog.updateBlog(name,//)
        //blog.save()
        return this.blogsRepo.updateBlog(id, name, description, websiteUrl)
    }
}