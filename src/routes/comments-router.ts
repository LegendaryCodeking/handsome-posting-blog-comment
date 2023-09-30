import {Router} from "express";
import {authMW} from "../middlewares/auth-mw";
import {contentValidation} from "../middlewares/comments-validation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {commentsController} from "../composition-root";


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
