import {Router} from "express";
import {AuthMW} from "../middlewares/auth-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {container} from "../composition-root";
import {likeStatusValidation} from "../middlewares/likes-mw";
import {CommentsController} from "../controller/comments-controller";

const commentsController = container.resolve(CommentsController)
const authMW = container.resolve(AuthMW)

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    commentsController.findCommentById.bind(commentsController)
)

commentsRouter.put('/:id',
    authMW.authenticationCheckBearer.bind(authMW),
    contentValidation,
    inputValidationMw,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.delete('/:id',
    authMW.authenticationCheckBearer.bind(authMW),
    inputValidationMw,
    commentsController.deleteComment.bind(commentsController)
)

// Likes

commentsRouter.put('/:id/like-status',
    authMW.authenticationCheckBearer.bind(authMW),
    likeStatusValidation,
    inputValidationMw,
    commentsController.sendLikeStatus.bind(commentsController)
)
