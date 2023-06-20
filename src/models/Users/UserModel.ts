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

