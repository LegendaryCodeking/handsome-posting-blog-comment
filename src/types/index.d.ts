import {UserViewModel} from "../models/Users/UserViewModel";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}