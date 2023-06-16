import {UserType} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserViewModel";

export const getUserViewModel = (user: UserType): UserViewModel => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}