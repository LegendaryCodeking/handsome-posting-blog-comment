import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import {usersRepo} from "../repos/users-repo";

export const authService = {
async confirmEmail(code: string | undefined): Promise<boolean> {
        if (code === undefined) return false

        let user = await usersQueryRepo.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode === code) return false
        if (new Date(user.emailConfirmation.expirationDate) > new Date()) return false

        return await usersRepo.updateConfirmation(user.id)


    }
}