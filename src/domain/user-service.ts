import {UsersRepo} from "../repos/users-repo";
import {UserDBModel, UserViewModel} from "../models/Users/UserModel";
import bcrypt from 'bcrypt';
import {UsersQueryRepo} from "../repos/query-repos/users-query-repo";
import {EmailManager} from "../managers/email-manager";
import {JwtService} from "../application/jwt-service";
import {inject, injectable} from "inversify";
import {MapUserViewModel} from "../helpers/map-UserViewModel";

enum ResultCode {
    success,
    internalServerError,
    badRequest,
    incorrectEmail
}

type Result<T> = {
    resultCode: ResultCode,
    data: T | null,
    errorMessage?: string
}

@injectable()
export class UserService {

    constructor(
        @inject(UsersQueryRepo) protected usersQueryRepo: UsersQueryRepo,
        @inject(UsersRepo) protected usersRepo: UsersRepo,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(EmailManager) protected emailManager: EmailManager,
        @inject(MapUserViewModel) protected mapUserViewModel: MapUserViewModel
    ) {
    }

    async createUser(login: string, password: string, email: string, isAuthorSuper: boolean): Promise<Result<string>> {

        const passwordHash = await bcrypt.hash(password, 10) //Соль генерируется автоматически за 10 кругов - второй параметр

        const createdUser = UserDBModel.createUser(login,email,isAuthorSuper,passwordHash)
        await this.usersRepo.save(createdUser)

        if (!isAuthorSuper) {
            this.emailManager.sendEmailConfirmationMessage(createdUser).catch((err) => console.log(err))
        }

        return {
            resultCode: ResultCode.success,
            data: createdUser._id.toString()
        }


    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.usersRepo.findUserById(id)
        if (!user) return false

        return await this.usersRepo.deleteUser(user)

    }

    async updatePassword(newPassword: string, userId: string): Promise<boolean> {
        const user = await this.usersRepo.findUserById(userId)
        if (!user) return false

        const passwordHash = await bcrypt.hash(newPassword, 10) //Соль генерируется автоматически за 10 кругов - второй параметр
        user.updatePass(passwordHash)

        await this.usersRepo.save(user)
        return true
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserViewModel | null> {
        const user = await this.usersRepo.findByLoginOrEmail(loginOrEmail)
        if (!user) return null


        const passHash = user.accountData.password

        const result = await bcrypt.compare(password, passHash).then(function (result) {
            return result
        });

        if (result) {
            return this.mapUserViewModel.getUserViewModel(user);
        }
        return null

    }

    async recoveryPassword(email: string): Promise<boolean> {
        const user = await this.usersQueryRepo.findByLoginOrEmail(email)
        // Return true even if current email is not registered (for prevent user's email detection)
        if (!user) return true
        const passwordRecoveryCode = await this.jwtService.createPassRecoveryCode(user)
        await this.usersRepo.addPassRecoveryCode(user.id, passwordRecoveryCode)

        try {
            await this.emailManager.sendPasswordRecoveryMessage(user.email, passwordRecoveryCode)
            return true
        } catch (e) {
            console.log(e)
            return false;
        }

    }

}