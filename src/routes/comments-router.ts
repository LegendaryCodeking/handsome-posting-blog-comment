import {Router} from "express";
import {authenticationCheckBearer} from "../middlewares/auth-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {commentsController} from "../controller/comments-controller";

export const commentsRouter = Router({})


commentsRouter.get('/:id',
    commentsController.findCommentById.bind(commentsController)
)

commentsRouter.put('/:id',
    authenticationCheckBearer,
    contentValidation,
    inputValidationMw,
    commentsController.updateComment.bind(commentsController)
)

commentsRouter.delete('/:id',
    authenticationCheckBearer,
    inputValidationMw,
    commentsController.deleteComment.bind(commentsController)
)
