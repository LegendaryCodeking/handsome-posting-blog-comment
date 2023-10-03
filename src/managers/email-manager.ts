import {EmailAdapter} from "../adapters/email-adapter";
import {UserDBModel} from "../models/Users/UserModel";
import {injectable} from "inversify";

@injectable()
export class EmailManager {
    private emailAdapter: EmailAdapter;

    constructor() {
        this.emailAdapter = new EmailAdapter()
    }

    async sendPasswordRecoveryMessage(email: string, code: string): Promise<void> {

        const messageRecovery = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
        await this.emailAdapter.sendEmail(email, "password recovery", messageRecovery)

    }

    async sendEmailConfirmationMessage(user: UserDBModel): Promise<void> {
        let MessageHTMLText = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`


        await this.emailAdapter.sendEmail(user.accountData.email, "Email confirmation", MessageHTMLText)
    }
}