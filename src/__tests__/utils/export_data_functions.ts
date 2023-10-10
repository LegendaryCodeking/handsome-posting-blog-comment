import {UserDBModel} from "../../models/Users/UserModel";
import {UserModelClass} from "../../db/db";

export const authBasicHeader = {Authorization: "Basic YWRtaW46cXdlcnR5"}

export function generateString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


class WorkingWithDB {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]}).lean()
        if (user) {
            return user
        }
        return null
    }
}


const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
const DbName =  process.env.MONGODBNAME || "forum";
export const connection_string = mongoUri + '/' + DbName
export const workingWithDB = new WorkingWithDB()