import {emailAdapter} from "../adapters/email-adapter";
import {UserDBModel} from "../models/Users/UserModel";


export const emailManager = {
    async sendPasswordRecoveryMessage(email: string, code: string) {

        const messageRecovery = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
        await emailAdapter.sendEmail(email, "password recovery",messageRecovery)

    },
    async sendEmailConfirmationMessage(user: UserDBModel) {
        let MessageHTMLText = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`


        await emailAdapter.sendEmail(user.accountData.email, "Email confirmation", MessageHTMLText)
    }
}