const nodeMailer = require("nodemailer");

const sendMail = async(options) => {
  const transPorter = nodeMailer.createTransport({
     service : process.env.SMTP_SERVICES,
     auth:{
         user:process.env.SMTP_GMAIL,
         pass:process.env.SMTP_PASSWORD
     },
  });

  const mailOptions = {
        from:process.env.smtp_mail,
        to:options?.email,
        Subject:options?.Subject,
        text:options?.message
  }

  await transPorter.sendMail(mailOptions)
};

module.exports = sendMail;
