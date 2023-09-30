import mongoose from "mongoose";
import {WithPagination} from "../custom";

export class UserDBModel {
    constructor(
        public id: string,
        public accountData: accountDataModel,
        public emailConfirmation: emailConfirmationModel,
        public passwordRecovery: passwordRecoveryModel
    ) {
    }
}

type accountDataModel = {
    login: string,
    email: string,
    password: string,
    createdAt: string
}

type emailConfirmationModel = {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}

type passwordRecoveryModel = {
    passwordRecoveryCode: string,
    active: boolean
}

// export type UserDBModel = {
//     id: string,
//     accountData: {
//         login: string,
//         email: string,
//         password: string,
//         createdAt: string
//     },
//     emailConfirmation: {
//         confirmationCode: string,
//         expirationDate: string,
//         isConfirmed: boolean
//     },
//     passwordRecovery: {
//         passwordRecoveryCode: string,
//         active: boolean
//     }
// }

export type UsersWithPaginationModel = WithPagination<UserViewModel>

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserCreateModel = {
    login: string
    password: string
    email: string
}

export const userMongoSchema = new mongoose.Schema<UserDBModel>({
    id: String,
    accountData: {
        login: String,
        email: String,
        password: String,
        createdAt: String
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: String,
        isConfirmed: Boolean
    },
    passwordRecovery: {
        passwordRecoveryCode: String,
        active: Boolean
    }
})
