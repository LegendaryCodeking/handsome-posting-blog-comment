import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {connection_string, workingWithDB} from "../utils/export_data_functions";
import mongoose from "mongoose";
import {UserCreateModel, UserDBModel} from "../../models/Users/UserModel";
import {UserModelClass} from "../../db/db";
import sub from "date-fns/sub";

describe('/Testing blogs', () => {
    let user1: UserDBModel | null;
    let user2: UserDBModel | null;
    beforeAll(async () => {
        await mongoose.connect(connection_string);
    })

    it('Delete all data before tests', async () => {
        await request(app)
            .delete(`${RouterPaths.testing}/all-data`)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })

    it('Registration 1', async () => {
        const data: UserCreateModel = {
            "login": "Landau",
            "password": "LandauMIPT144",
            "email": "LandauMIPT144@gmailya.com",
        }

       await request(app)
            .post(`${RouterPaths.auth}/registration`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        user1 = await workingWithDB.findByLoginOrEmail(data.email)
        expect(user1).not.toBe(null)
        if(user1 !== null) {
            expect(user1.emailConfirmation.isConfirmed).toBe(false)
            expect(typeof user1.emailConfirmation.confirmationCode).toBe('string');
        }
    })

    it('Registration 2', async () => {
        const data: UserCreateModel = {
            "login": "Landau_2",
            "password": "LandauSFEDU12",
            "email": "LandauSFEDU12@gmailya.com",
        }

        await request(app)
            .post(`${RouterPaths.auth}/registration`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        user2 = await workingWithDB.findByLoginOrEmail(data.email)
        expect(user2).not.toBe(null)
        if(user2 !== null) {
            expect(user2.emailConfirmation.isConfirmed).toBe(false)
            expect(typeof user2.emailConfirmation.confirmationCode).toBe('string');
        }
    })


    it('Registration confirmation BAD 400 ', async () => {

        const dataConfirmationGood = {
            "code": user1!.emailConfirmation.confirmationCode
        }

        const dataConfirmationBad1 = {
            "code": user1!.emailConfirmation.confirmationCode + "h"
        }

        await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send(dataConfirmationBad1)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        await UserModelClass.updateOne({"_id": user1!._id}, {
                $set: {
                    "emailConfirmation.isConfirmed": true,
                }
            });

        await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send(dataConfirmationGood)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

        await UserModelClass.updateOne({"_id": user1!._id}, {
            $set: {
                "emailConfirmation.isConfirmed": false,
                "emailConfirmation.expirationDate": sub(new Date(), {hours: 10}).toISOString(),
            }
        });

        await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send(dataConfirmationGood)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

        await UserModelClass.updateOne({"_id": user1!._id}, {
            $set: {
                "emailConfirmation.expirationDate": user1!.emailConfirmation.expirationDate
            }
        });

    })


    it('Registration confirmation GOOD user 1 ', async () => {

        const dataConfirmation1 = {
            "code": user1!.emailConfirmation.confirmationCode
        }


        await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send(dataConfirmation1)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        await request(app)
            .post(`${RouterPaths.auth}/registration-confirmation`)
            .send(dataConfirmation1)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

        user1 = await workingWithDB.findByLoginOrEmail(user1!.accountData.email)
        expect(user1).not.toBe(null)
        if(user1 !== null) {
            expect(user1.emailConfirmation.isConfirmed).toBe(true)
        }
    })

    it('Registration confirmation GOOD user 2 ', async () => {
        // Обернул в setTimeout чтоы не было 429
        setTimeout(async function() {
            const dataConfirmation1 = {
                "code": user2!.emailConfirmation.confirmationCode
            }

            await request(app)
                .post(`${RouterPaths.auth}/registration-confirmation`)
                .send(dataConfirmation1)
                .expect(STATUSES_HTTP.NO_CONTENT_204)

            await request(app)
                .post(`${RouterPaths.auth}/registration-confirmation`)
                .send(dataConfirmation1)
                .expect(STATUSES_HTTP.BAD_REQUEST_400)

            user2 = await workingWithDB.findByLoginOrEmail(user2!.accountData.email)
            expect(user2).not.toBe(null)
            if(user2 !== null) {
                expect(user2.emailConfirmation.isConfirmed).toBe(true)
            }
        }, 2000);

    })


    it("should send email with code", async () => {
        const data = {
            "email": user2!.accountData.email
        }

        await request(app)
            .post(`${RouterPaths.auth}/password-recovery`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

    })

    it("should return error if password is incorrect; status 400;", async () => {
        setTimeout(async function() {
        const userDB = await UserModelClass.findOne({"accountData.email": user2!.accountData.email})
        const data = {
            "newPassword": "short",
            "recoveryCode": userDB!.passwordRecovery!.passwordRecoveryCode
        }

        await request(app)
            .post(`${RouterPaths.auth}/new-password`)
            .send(data)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)
        }, 2000);

    })


    it("should update password;", async () => {
        setTimeout(async function() {
        let  userDB = await UserModelClass.findOne({"accountData.email": user2!.accountData.email})
        const data = {
            "newPassword": "new_password",
            "recoveryCode": userDB!.passwordRecovery!.passwordRecoveryCode
        }

        const old_pass = userDB!.accountData.password
        await request(app)
            .post(`${RouterPaths.auth}/new-password`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        userDB = await UserModelClass.findOne({"accountData.email": user2!.accountData.email})
        expect(userDB!.accountData.password === old_pass).toBe(false)
        expect(userDB!.passwordRecovery.active).toBe(false);
        }, 2000);

    })


    afterAll(async () => {
        await mongoose.disconnect()
    })

})