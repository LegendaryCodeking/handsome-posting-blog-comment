import {UserViewModel} from "./models/Users/UserModel";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}