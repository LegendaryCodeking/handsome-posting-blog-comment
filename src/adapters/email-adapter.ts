import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

export const emailAdapter = {
    async sendEmail(email : string, subject: string, message: string) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_LOGIN, // generated ethereal user
                pass: process.env.GMAIL_PASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'luckyegor1997@gmail.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message , // html body
        });


        console.log(info)

    }
}