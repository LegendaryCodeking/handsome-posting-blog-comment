import {Router} from "express";
import {authenticationCheckBearer} from "../middlewares/auth-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {commentsController} from "../controller/comments-controller";

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    commentsController.findCommentById
)

commentsRouter.put('/:id',
    authenticationCheckBearer,
    contentValidation,
    inputValidationMw,
    commentsController.updateComment
)

commentsRouter.delete('/:id',
    authenticationCheckBearer,
    inputValidationMw,
    commentsController.deleteComment
)
