import {Router} from 'express'
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {authenticationCheck, authenticationCheckBearer} from "../middlewares/auth-mw";
import {blogId, content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {postsController} from "../controller/posts-controller";

export const postsRouter = Router({})

postsRouter.get('/', postsController.findAllPosts.bind(postsController))

postsRouter.get('/:id', postsController.findPostById.bind(postsController))

postsRouter.delete('/:id',
    authenticationCheck,
    postsController.deletePost.bind(postsController))

postsRouter.post('/',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    postsController.createPost.bind(postsController)
)

postsRouter.put('/:id',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    postsController.updatePost.bind(postsController)
)

////////////////////////////
// working with comments
////////////////////////////
postsRouter.post('/:postId/comments',
    authenticationCheckBearer,
    contentValidation,
    inputValidationMw,
    postsController.createCommentForPost.bind(postsController))

postsRouter.get('/:postId/comments',
    postsController.getCommentsForPost.bind(postsController))
