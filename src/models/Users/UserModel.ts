import mongoose, {HydratedDocument} from "mongoose";
import {WithPagination} from "../custom";
import {ObjectId} from "mongodb";
import {UserModelClass} from "../../db/db";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class UserDBModel {
    constructor(
        public _id: ObjectId,
        public accountData: accountDataModel,
        public emailConfirmation: emailConfirmationModel,
        public passwordRecovery: passwordRecoveryModel
    ) {
    }

    static createUser(login: string, email: string, isAuthorSuper: boolean, passwordHash: string): HydratedDocument<UserDBModel> {
        const userInstance = new UserModelClass()

        userInstance._id = new ObjectId()
        userInstance.accountData = {
            login: login,
            email: email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        userInstance.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }).toISOString(),
            isConfirmed: false
        }
        userInstance.passwordRecovery = {
            passwordRecoveryCode: "",
            active: isAuthorSuper
        }

        return userInstance
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
