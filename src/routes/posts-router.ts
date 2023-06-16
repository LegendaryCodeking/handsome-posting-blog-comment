import {Router} from 'express'
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {authenticationCheck, authenticationCheckBearer} from "../middlewares/auth-mw";
import {blogId, content, shortDescription, titleValidation} from "../middlewares/post-validation-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {postsController} from "../controller/posts-controller";

export const postsRouter = Router({})

postsRouter.get('/', postsController.findAllPosts)

postsRouter.get('/:id', postsController.findPostById)

postsRouter.delete('/:id',
    authenticationCheck,
    postsController.deletePost)

postsRouter.post('/',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    postsController.createPost
    )

postsRouter.put('/:id',
    authenticationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    postsController.updatePost
)

////////////////////////////
// working with comments
////////////////////////////
postsRouter.post('/:postId/comments',
    authenticationCheckBearer,
    contentValidation,
    inputValidationMw,
    postsController.createCommentForPost )

postsRouter.get('/:postId/comments',
    postsController.getCommentsForPost)
