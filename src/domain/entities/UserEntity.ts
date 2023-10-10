import mongoose, {Model} from "mongoose";
import {ObjectId} from "mongodb";
import {UserDBModel} from "../../models/Users/UserModel";

export type userDBMethodsType = {
    canBeConfirmed: (code: string) => Boolean
    confirm: (code: string) => void
}

export type userModelType = Model<UserDBModel, {}, userDBMethodsType>


export const userMongoSchema = new mongoose.Schema<UserDBModel, userModelType, userDBMethodsType>({
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

userMongoSchema.method('canBeConfirmed', function canBeConfirmed(code): Boolean {
    return !this.emailConfirmation.isConfirmed
        && this.emailConfirmation.confirmationCode === code
        && (new Date(this.emailConfirmation.expirationDate) >= new Date())
});

userMongoSchema.method('confirm', function confirm(code): void {
    // Делаем проверку все равно в этом слое, даже если раньше были проверки в других слоях
    if (!this.canBeConfirmed(code)) throw new Error("Account can't be confirmed")

    this.emailConfirmation.isConfirmed = true
});
