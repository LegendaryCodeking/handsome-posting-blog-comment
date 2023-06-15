import {UserViewModel} from "./models/UserViewModel";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}