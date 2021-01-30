import dbConnect from '@/utils/dbConnect';
import type { AccountRecoveryHandlers } from '../recovery';
import nodemailer from 'nodemailer';
import User from '@/models/User';
import bcrypt from 'bcrypt'

const recoveryHandler: AccountRecoveryHandlers['recovery'] = async ({
    res,
    // req,
    body: { email, nickName, phone },
    // config,
}) => {

    try {
        await dbConnect()

        const userInfo = await User.findOne({ email: email })
        if (!userInfo) {
            return res.status(400).json({
                data: null,
                errors: [{ message: 'Not found', code: 'ERROR-000001' }],
            }); 
        }

        let randomNumber : string = '';
        for (let i = 0; i < 4; i++) {
            randomNumber += Math.floor(Math.random() * 10)
        }

        const newPassword = `ABCD${randomNumber}`

        // Update account
        bcrypt.hash(newPassword, 10, async function(err, hash) {
            if (err) {
                return res.status(400).json({
                    data: null,
                    errors: [{ message: 'ERROR Hash Password', code: 'ERROR-000002' }],
                }); 
            }
            await User.findByIdAndUpdate(userInfo._id, {password: hash})
        });

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport({
        //     host: "mail.datvietsoftware.com.vn",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: 'lienhe@datvietsoftware.com.vn', // generated ethereal user
        //         pass: 'zaqdatvietmaicty@', // generated ethereal password
        //     },
        //     tls: {rejectUnauthorized:false},
        // });
        
        // // send mail with defined transport object
        // let info = await transporter.sendMail({
        //     from: '"DatViet Software 👻" <lienhe@datvietsoftware.com.vn>', // sender address
        //     to: `${email}`, // list of receivers
        //     subject: "Hello ✔", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>Hello world?</b>", // html body
        // });

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>Hello world?</b>
                <h1>New Password<h1>
                <h2>${newPassword}<h2>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        return res.status(200).json({ data: `Preview URL: ${nodemailer.getTestMessageUrl(info)}`})
    } catch (error) {
        return res.status(500).json({
            data: null,
            errors: [{ message: error.message }],
        });
    }
}

export default recoveryHandler