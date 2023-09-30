import {Router} from 'express'
import {descriptionValidation, nameValidation, urlValidation} from "../middlewares/blog-validation-mw";
import {authenticationCheck} from "../middlewares/auth-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {blogsController} from "../controller/blogs-controller";

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.FindAllBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.findBlogById.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.findPostsForBlog.bind(blogsController))

blogsRouter.delete('/:id',
    authenticationCheck,
    blogsController.deleteBlog.bind(blogsController))

blogsRouter.post('/',
    authenticationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:id/posts',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    inputValidationMw,
    blogsController.createPostsForBlog.bind(blogsController))


blogsRouter.put('/:id',
    authenticationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    blogsController.updateBlog.bind(blogsController)
)