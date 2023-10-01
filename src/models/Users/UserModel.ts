import mongoose from "mongoose";
import {WithPagination} from "../custom";
import {ObjectId} from "mongodb";

export class UserDBModel {
    constructor(
        public _id: ObjectId,
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
    _id: ObjectId,
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
