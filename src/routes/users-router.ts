import {Router} from "express";
import {AuthMW} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {container} from "../composition-root";
import {UsersController} from "../controller/users-controller";

const usersController = container.resolve(UsersController)
const authMW = container.resolve(AuthMW)

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