import {Router} from 'express'
import {descriptionValidation, nameValidation, urlValidation} from "../middlewares/blog-validation-mw";
import {authenticationCheck} from "../middlewares/auth-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {blogsController} from "../controller/blogs-controller";

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.FindAllBlog)

blogsRouter.get('/:id', blogsController.findBlogById)

blogsRouter.get('/:id/posts', blogsController.findPostsForBlog)

blogsRouter.delete('/:id',
    authenticationCheck,
    blogsController.deleteBlog)

blogsRouter.post('/',
    authenticationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    blogsController.createBlog)

blogsRouter.post('/:id/posts',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    inputValidationMw,
    blogsController.createPostsForBlog)


blogsRouter.put('/:id',
    authenticationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    blogsController.updateBlog
)