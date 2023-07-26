import {UserViewModel} from "./models/Users/UserModel";

// Расширяем Request чтобы в нем было свойство user
declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}