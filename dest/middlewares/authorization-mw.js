"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationCheck = void 0;
const authorizationCheck = (req, res, next) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.authorizationCheck = authorizationCheck;
// import {jwtService} from "../application/jwt-service";
// import {userService} from "../domain/user-service";
//
//
// export const authorizationCheck = async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.headers.authorization) {
//         res.sendStatus(401)
//         return
//     }
//
//     const token = req.headers.authorization.split(' ')[1]
//
//     const userID = await jwtService.getUserIdByToken(token)
//     if(userID) {
//         req.user = await userService.findUserById(userID)
//         next()
//         return;
//     }
//     res.sendStatus(401)
// }
