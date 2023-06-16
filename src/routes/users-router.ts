import {Router} from "express";
import {authenticationCheck} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {usersController} from "../controller/users-controller";

export const usersRouter = Router({})

usersRouter.get('/',
    authenticationCheck,
    usersController.findAllUsers)

usersRouter.post('/',
    authenticationCheck,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    usersController.createUser)

usersRouter.delete('/:id',
    authenticationCheck,
    usersController.deleteUser )