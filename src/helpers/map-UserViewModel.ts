import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";
import {injectable} from "inversify";

@injectable()
export class MapUserViewModel {
    getUserViewModel (user: UserDBModel): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }
}

