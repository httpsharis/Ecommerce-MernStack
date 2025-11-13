const nodeMailer = require('nodemailer')

const sendEmail = async (options) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const mailOption = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOption)

};

module.exports = sendEmail;