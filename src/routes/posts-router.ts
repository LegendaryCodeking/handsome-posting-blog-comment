import {Router} from 'express'
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {AuthMW} from "../middlewares/auth-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {container} from "../composition-root";
import {likeStatusValidation} from "../middlewares/likes-mw";
import {PostsController} from "../controller/posts-controller";
import {PostValidationMW} from "../middlewares/post-validation-mw";

const postsController = container.resolve(PostsController)
const postValidationMW = container.resolve(PostValidationMW)
const authMW = container.resolve(AuthMW)

export const postsRouter = Router({})

postsRouter.get('/', postsController.findAllPosts.bind(postsController))

postsRouter.get('/:id', postsController.findPostById.bind(postsController))

postsRouter.delete('/:id',
    authMW.authenticationCheck.bind(authMW),
    postsController.deletePost.bind(postsController))

postsRouter.post('/',
    authMW.authenticationCheck.bind(authMW),
    postValidationMW.titleValidation.bind(postValidationMW),
    postValidationMW.shortDescription.bind(postValidationMW),
    postValidationMW.content.bind(postValidationMW),
    postValidationMW.blogId.bind(postValidationMW),
    inputValidationMw,
    postsController.createPost.bind(postsController)
)

postsRouter.put('/:id',
    authMW.authenticationCheck.bind(authMW),
    postValidationMW.titleValidation.bind(postValidationMW),
    postValidationMW.shortDescription.bind(postValidationMW),
    postValidationMW.content.bind(postValidationMW),
    postValidationMW.blogId.bind(postValidationMW),
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

////////////////////////////
// working with likes
////////////////////////////

postsRouter.put('/:id/like-status',
    authMW.authenticationCheckBearer.bind(authMW),
    likeStatusValidation,
    inputValidationMw,
    postsController.sendLikeStatus.bind(postsController)
)