import {body} from "express-validator";

export const contentValidation = body("content")
    .isString().withMessage(`Content field should be string type`)
    .trim()
    .isLength({min: 20, max: 300}).withMessage(`Comment's length should be from 20 to 300 symbols`)
