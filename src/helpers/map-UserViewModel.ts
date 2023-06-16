import {UserType} from "../models/UserModel";
import {UserViewModel} from "../models/UserViewModel";

export const getUserViewModel = (user: UserType): UserViewModel => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}