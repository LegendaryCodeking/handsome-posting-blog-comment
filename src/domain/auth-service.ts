import {UsersRepo} from "../repos/users-repo";
import {EmailManager} from "../managers/email-manager";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class AuthService {

    constructor(
        protected usersRepo: UsersRepo,
        protected emailManager: EmailManager
    ) {
    }

    async confirmEmail(code: string | undefined): Promise<boolean> {
        if (code === undefined) return false

        let user = await this.usersRepo.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (new Date(user.emailConfirmation.expirationDate) < new Date()) return false

        return await this.usersRepo.updateConfirmation(user.id)

    }

    async resendEmail(email: string): Promise<boolean> {
        if (email === undefined) return false
        let user = await this.usersRepo.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false

        // Обновляем код подтверждения
        user.emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }).toISOString(),
            isConfirmed: false
        }
        //Перезаписываем пользователя
        let updatedUser = await this.usersRepo.updateUserEmailConfirmationInfo(user._id, user)
        if (!updatedUser) return false

        try {
            await this.emailManager.sendEmailConfirmationMessage(user)
        } catch (e) {
            console.log(e)
            return false;
        }
        return true
    }
}