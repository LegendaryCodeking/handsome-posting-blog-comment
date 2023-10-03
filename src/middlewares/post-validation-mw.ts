import {body} from "express-validator";
import {BlogsQueryRepo} from "../repos/query-repos/blogs-query-repo";
import {inject, injectable} from "inversify";

@injectable()
export class PostValidationMW {

    constructor(@inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo) {

    }

    titleValidation = body("title")
        .isString().withMessage("Title should be string")
        .trim()
        .isLength({min: 1, max: 15}).withMessage("The length should be from 1 to 15 symbols");

    shortDescription = body("shortDescription")
        .isString().withMessage("shortDescription should be string")
        .trim()
        .isLength({min: 1, max: 100}).withMessage("The length should be from 1 to 100 symbols");

    content = body("content")
        .isString().withMessage("content should be string")
        .trim()
        .isLength({min: 1, max: 1000})
        .withMessage("The length should be from 1 to 1000 symbols");

    blogId = body('blogId')
        .isString().withMessage("blogId should be string")
        .trim().isLength({min: 1, max: 100}).withMessage("The length should be > 0")
        .custom(async value => {
            const foundBlog = await this.blogsQueryRepo.findBlogById(value);
            if (!foundBlog) {
                throw new Error('There is no blog with such ID');
            }
        })
}

