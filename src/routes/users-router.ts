import {Router} from "express";
import {authMW} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {usersController} from "../controller/users-controller";

export const usersRouter = Router({})

usersRouter.get('/',
    authMW.authenticationCheck.bind(authMW),
    usersController.findAllUsers.bind(usersController))

usersRouter.post('/',
    authMW.authenticationCheck.bind(authMW),
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id',
    authMW.authenticationCheck.bind(authMW),
    usersController.deleteUser.bind(usersController))