const nodemailer = require('nodemailer')
const config = require('../config/config')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 8000,
    secure: false,
    auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PASSWORD,
    },
});


const sendMail = async (userData) => {
    var mailOptions = {
        from: config.SMTP_EMAIL,
        to: userData.email,
        subject: 'User Registration successFully',
        html: `<head>
        </head>
        <body>
            <div style="margin:0 auto;max-width:600px;">
                <p>Hi,${userData.first_name}</br>
                Congratulation, You Registration Successfully Done.!
            </br></br>
            Thanks
            </div>
        </body>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = sendMail