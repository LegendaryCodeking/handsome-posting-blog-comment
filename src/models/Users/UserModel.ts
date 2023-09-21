import mongoose from "mongoose";

export type UserDBModel = {
    id: string,
    accountData: {
        login: string,
        email: string,
        password: string,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: string,
        isConfirmed: boolean
    }
}

export type UsersWithPaginationModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": UserViewModel[]
}

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
    }
})
