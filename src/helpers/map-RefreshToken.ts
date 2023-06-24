import {RefreshTokenDbModel, RefreshTokenViewModel} from "../models/Tokens/refreshToken-model";


export const getRefreshTokenViewModel = (token: RefreshTokenDbModel): RefreshTokenViewModel => {
    return {
        "refreshToken": token.refreshToken,
        "isAlive": token.isAlive
    }
}