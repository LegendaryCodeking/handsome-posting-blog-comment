import {Router} from 'express'
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {authMW} from "../middlewares/auth-mw";
import {blogId, content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {postsController} from "../controller/posts-controller";

export const postsRouter = Router({})

postsRouter.get('/', postsController.findAllPosts.bind(postsController))

postsRouter.get('/:id', postsController.findPostById.bind(postsController))

postsRouter.delete('/:id',
    authMW.authenticationCheck.bind(authMW),
    postsController.deletePost.bind(postsController))

postsRouter.post('/',
    authMW.authenticationCheck.bind(authMW),
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    postsController.createPost.bind(postsController)
)

postsRouter.put('/:id',
    authMW.authenticationCheck.bind(authMW),
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
    authMW.authenticationCheckBearer.bind(authMW),
    contentValidation,
    inputValidationMw,
    postsController.createCommentForPost.bind(postsController))

postsRouter.get('/:postId/comments',
    postsController.getCommentsForPost.bind(postsController))
