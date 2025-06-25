import prisma from "../config/prisma.js";
import bcrypt from 'bcrypt'
import generateToken from "../utills/generateToken.js";
import sendEmail from "../utills/sendEmail.js";
import jwt from 'jsonwebtoken'
// Authentication routes 
const AdminRegister = async (req, res) => {
  // name,email,password,phone
  try {
    const { name, email, password, phone } = req.body

    const existingAdmin = await prisma.users.findUnique({
      where: {
        email: email
      }
    })

    if (existingAdmin) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashedpassword = await bcrypt.hash(password, 5)

    const newAdmin = await prisma.users.create({
      data: {
        name,
        email,
        phone,
        hashedPassword: hashedpassword,
        admin: true,
      }
    })
    const mail = await sendEmail({
      to: newAdmin.email,
      subject: 'Registration Successful',
      text: `Dear ${newAdmin.name} Congratulations! You have successfully registered on the ticketswap application`
    })
    console.log('mail', mail)
    res.status(200).json({
      status: 'success',
      message: "Admin registered successfully",
      resp_object: newAdmin,
    })
  } catch (err) {
    console.error("Error in AdminRegister:", err);
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

const AdminLogin = async (req, res) => {
  // email,password
  try {
    const { email, password } = req.body

    const Adminexists = await prisma.users.findUnique({
      where: {
        email: email
      }
    })
    if (!Adminexists) {
      return res.status(400).json({ message: "Email doesn't exists" });
    }
    const checkcredientials = Adminexists && (await bcrypt.compare(password, Adminexists.hashedPassword))
    console.log('checkcredientials', checkcredientials)
    if (!checkcredientials) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Credentials"
      })
    }
    const accessToken = generateToken(req.body)
    console.log('accesstoken', accessToken)
    // await prisma.tokenReset.create({
    //   data: {
    //     user_id: Adminexists.id,
    //     token: accessToken
    //   }
    // })

    await sendEmail({
      to: Adminexists.email,
      subject: 'LoggedIn Successful',
      text: `Dear ${Adminexists.name} Congratulations! You have successfully registered on the ticketswap application`
    })

    res.status(200).json({
      status: "success",
      message: "successfully logged in",
      resp_object: {
        _id: Adminexists.id,
        email: Adminexists.email,
        token: accessToken
      }
    })

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

// const AdminLogout = (req, res, next) => {

// }

const ForgetPassword = async (req, res, next) => {
  // phone or email newpassword
  try {
    const { email } = req.body
    console.log('email', email)
    const finduser = await prisma.users.findUnique({
      where: {
        email: email
      }
    })
    console.log('finduser', finduser)
    if (!finduser) {
      return res.status(404).json({
        status: 'failed',
        message: "User does not exists"
      })
    }
    const secret = process.env.SECRETKEY + finduser.hashedPassword
    const payload = {
      email: finduser.email,
      id: finduser.id,
    };
    console.log('payload', payload)
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/admin/reset-password/${finduser.id}/${token}`
    console.log('link', link)
    const mail = await sendEmail({
      to: finduser.email, // Use the found user's email
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              text-align: center;
            }
            p {
              font-size: 16px;
              color: #555555;
            }
            .button {
              display: inline-block;
              padding: 15px 25px;
              font-size: 16px;
              color: #ffffff;
              background-color: #1a82e2;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #888888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>Hi ${finduser.name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <a href="${link}" class="button">Reset Password</a>
            <p>If you didn’t request this change, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </body>
        </html>
      `,
    });
    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent successfully.'
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

const resetPasswordForm = async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log('id,token', id, token)
    const finduser = prisma.users.findUnique({
      where: {
        id: id
      }
    })
    if (!finduser) {
      return res.send('Invalid id...')
    }
    const secret = process.env.SECRETKEY + finduser.hashedPassword
    console.log(secret)
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      res.render('reset-password');
    })

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }

}

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    const finduser = prisma.users.findUnique({
      where: {
        id: id
      }
    })
    if (!finduser) {
      return res.send('Invalid id...')
    }

    const secret = process.env.SECRETKEY + finduser.hashedPassword
    jwt.verify(token, secret, async (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "same"
        })
      }
      const hashedpassword = await bcrypt.hash(password, 5)
      const update = await prisma.users.update({
        where: {
          id: id
        },
        data: {
          hashedPassword: hashedpassword
        }
      })

      await sendEmail({
        to: finduser.email,
        subject: "Password Reset Successfull",
        text: "your password has been reset successfully"
      })
      res.redirect(`http://localhost:5173/`);
      res.status(200).json({
        status: "success",
        message: "password reset successful",
        resp_object: {
          updatedata: update
        }
      })
    })

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

const AdminFetchAllTickets = async (req, res, next) => {
  console.log("AdminFetchAllTickets")
  try {
    const tickets = await prisma.tickets.findMany()
    if (!tickets) {
      return res.status(404).json({
        status: "failed",
        message: "either no data or something went wrong"
      })
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched all tickets",
      resp_object: tickets
    })
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}


const AdminInsertTicket = async (req, res, next) => {
  // for deleteing uploaded ticket
  // ticketid
  console.log("AdminInsertTicket")
  try {
    const { user_id, bus_company, departure, arrival, mustbe, date, time, seat_number, price, ticketurl } = req.body
    console.log('body', req.body)
    // const formtedDate = (new Date(date + 'Z')).toISOString();
    const insertdata = await prisma.tickets.create({
      data: {
        user_id,
        bus_company,
        departure,
        arrival,
        // must_be: mustbe,
        departure_date: date,
        departure_time: time,
        seat_number,
        price,
        ticket_url: ticketurl
      }
    })
    console.log('insertdata', insertdata)
    res.status(200).json({
      status: 'success',
      message: "successfully inserted data",
      resp_object: {
        ticket: insertdata
      }
    })
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

const AdminFetchAllTransaction = async (req, res, next) => {
  // get
  console.log('AdminFetchAllTransaction')
  try {
    const data = await prisma.users.findMany()
    if (!data) {
      return res.status(404).json({
        status: "failed",
        message: "either no data or something went wrong"
      })
    }
    res.status(200).json({
      status: 'succces',
      message: "successfully fetched all transactions",
      resp_object: {
        transactions: data
      }
    })
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }

}

export {
  AdminRegister,
  AdminLogin,
  // AdminLogout,
  ForgetPassword,
  resetPasswordForm,
  resetPassword,
  AdminFetchAllTickets,
  AdminInsertTicket,
  AdminFetchAllTransaction,
}