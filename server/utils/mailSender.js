const nodemailer = require('nodemailer');

// tumhare mail wale function me kya kya aa rahe h.. email, subject, message.. yahi sab

const mailSender = async (email, title, body) =>
    {
        try {
            // nodemailer ke formate ke accorfing hamene tranporter banaya...
            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth:
                {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })

            // ab hamloog mail send karne ke liye... sendmail function ka use karenge
            let info = await transporter.sendMail({
                from: 'StudyNotion || CodeHelp - by Babbar',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })

            console.log(info);
            return info;
        }
        catch (error)
        {
            console.log(error); // <---  tumen ye kiya 
            console.log(error.message)// <--- love babbar ne ye kiye

        }
}

module.exports = mailSender;
