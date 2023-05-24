import {body} from "express-validator";

export const passwordValidation = body("name")
    .isString().withMessage(`Pass should be string`)
    .trim()
    .isLength({min: 6, max: 20}).withMessage(`Pass length should be from 6 to 20 symbols`)

export const loginValidation = body("name")
    .isString().withMessage(`login should be string`)
    .trim()
    .isLength({min: 3, max: 10}).withMessage(`login length should be from 3 to 10 symbols`)
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage(`ERROR login contains inappropriate symbols`)

export const emailValidation = body("email")
    .isString().withMessage(`Email should be string`)
    .trim()
    .isLength({min: 5, max: 50}).withMessage(`Email length should be from 5 to 50 symbols`)
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage(`ERROR email contains inappropriate symbols`)