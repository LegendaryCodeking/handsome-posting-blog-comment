import {body} from "express-validator";
import {blogsQueryRepo} from "../repos/query-repos/blogs-query-repo";

export const titleValidation = body("title")
    .isString().withMessage("Title should be string")
    .trim()
    .isLength({min: 1, max: 15}).withMessage("The length should be from 1 to 15 symbols")

export const shortDescription = body("shortDescription")
    .isString().withMessage("shortDescription should be string")
    .trim()
    .isLength({min: 1, max: 100}).withMessage("The length should be from 1 to 100 symbols")

export const content = body("content")
    .isString().withMessage("content should be string")
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage("The length should be from 1 to 1000 symbols")

export const blogId = body('blogId')
    .isString().withMessage("blogId should be string")
    .trim().isLength({min: 1,max: 100}).withMessage("The length should be > 0")
    .custom(async value => {
    const foundBlog = await blogsQueryRepo.findBlogById(value);
    if (!foundBlog) {
        throw new Error('There is no blog with such ID');
    }
})