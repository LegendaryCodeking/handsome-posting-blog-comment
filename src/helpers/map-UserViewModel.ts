import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";

export const getUserViewModel = (user: UserDBModel): UserViewModel => {
    return {
        id: user.id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}