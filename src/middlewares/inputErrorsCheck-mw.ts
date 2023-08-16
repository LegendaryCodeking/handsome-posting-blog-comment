import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {STATUSES_HTTP} from "../enum/http-statuses";

export const inputValidationMw = (req: Request, res: Response, next: NextFunction) => {
    console.log("Отработали loginValidation passwordValidation emailValidation - " + (Date.now() - req.TimeStamp))
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({
                errorsMessages: result.array({onlyFirstError: true}).map(val => ({
                    "message": val.msg,
                    //@ts-ignore
                    "field": val["path"]
                }))
            });
    } else {
        console.log("Отработали inputValidationMw - " + (req.TimeStamp - Date.now()))
        next();
    }
}
