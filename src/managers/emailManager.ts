import {emailAdapter} from "../adapters/email-adapter";
import {UserDBModel} from "../models/Users/UserModel";


export const emailManager = {
    async sendPasswordRecoveryMessage(user: any) {

        await emailAdapter.sendEmail("user.email","password recovery","<div>${user.recoveryCode}Recovery message</div>>")

    },
    sendEmailConfirmationMessage(user: UserDBModel) {

    }
}