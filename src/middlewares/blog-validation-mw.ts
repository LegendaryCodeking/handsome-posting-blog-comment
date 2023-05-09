import {body} from "express-validator";

export const nameValidation = body("name")
    .isString().withMessage(`Name should be string`)
    .trim()
    .isLength({min: 1, max: 15}).withMessage(`name length should be from 1 to 15 symbols`)


export const descriptionValidation = body("description")
    .isString().withMessage(`description should be string type`)
    .trim()
    .isLength({min: 1, max: 500}).withMessage(`description length should be from 1 to 500 symbols`)

export const urlValidation = body("websiteUrl")
    .isString().withMessage(`websiteUrl should be string type`)
    .isURL({protocols: ['https']}).withMessage(`websiteUrl should be correct URL`)
    .isLength({min: 1, max: 100}).withMessage(`websiteUrl length should be from 1 to 100 symbols`)
