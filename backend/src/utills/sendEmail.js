import nodemailer from 'nodemailer'

const sendEmail = (options) => {

  const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      // user: process.env.SENDEREMAIL,
      // pass: process.env.SENDERPASS
      user: "vsaijayesh94@gmail.com",
      pass: "ffcu sqke lnkx unou"
    },
    // tls: {
    //   rejectUnauthorized: false
    // },
    debug: true, // show debug output
    logger: true // log information in console
  });

  const mailOptions = {
    from: 'vsaijayesh94@gmail.com',
    // to: options?.to,
    // subject: options?.subject,
    // text: options?.text
    ...options
  }
  transporter.sendMail(mailOptions)
}

export default sendEmail