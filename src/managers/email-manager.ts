import {emailAdapter} from "../adapters/email-adapter";
import {UserDBModel} from "../models/Users/UserModel";


export const emailManager = {
    async sendPasswordRecoveryMessage(user: any) {

        await emailAdapter.sendEmail("user.email", "password recovery", "<div>${user.recoveryCode}Recovery message</div>>")

    },
    async sendEmailConfirmationMessage(user: UserDBModel): Promise<void> {
        let MessageHTMLText = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`


        await emailAdapter.sendEmail(user.accountData.email, "Email confirmation", MessageHTMLText)
    }
}