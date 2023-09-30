import {Router} from "express";
import {authenticationCheck} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {usersController} from "../controller/users-controller";

export const usersRouter = Router({})

usersRouter.get('/',
    authenticationCheck,
    usersController.findAllUsers.bind(usersController))

usersRouter.post('/',
    authenticationCheck,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id',
    authenticationCheck,
    usersController.deleteUser.bind(usersController))