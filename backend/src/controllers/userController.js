import prisma from "../config/prisma.js";
import Razorpay from 'razorpay'
import crypto from 'crypto';
import sendEmail from "../utills/sendEmail.js";
import bcrypt from 'bcrypt';
import generateToken from "../utills/generateToken.js";
import multer from 'multer';
import pdfParser from 'pdf-parse'



// Authentication routes 
const userRegister = async (req, res) => {
  console.log('user register')
  // name,email,password,phone
  try {

  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    })
  }
}

const userLogin = async (req, res, next) => {
  // email,password
  try {
    const { email, password } = req.body
    const finduser = await prisma.users.findUnique({
      where: {
        email: email
      }
    })
    if (!finduser) {
      return res.status(400).json({
        status: "failed",
        message: "user not registed"
      })
    }
    const checkCredientials = email && (await bcrypt.compare(password, finduser.hashedPassword))
    if (!checkCredientials) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid Credentials"
      })
    }
    const token = await generateToken(req.body)

    await sendEmail({
      to: email,
      subject: "Login Successful",
      text: `Dear ${finduser.name} u have successfully loggedIn`
    })

    res.status(200).json({
      status: "success",
      message: "Successful loggedIn",
      resp_object: {
        id: finduser.id,
        email: finduser.email,
        token: token
      }
    })

  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    })
  }
}

// const userLogout = (req, res, next) => {

// }

// const userForgetPassword = (req, res, next) => {
//   // phone newpassword
//   // forget password used the same controls from admin instead of creating a new one
// }

// 
// 
//  forget password used the same controls from admin instead of creating a new one
// 
// 

// Tickets
const userFetchAllTickets = async (req, res, next) => {
  // to get all tickets
  // source, distination, date
  try {
    const { departure, arrival, date } = req.body
    const findticket = await prisma.tickets.findMany({
      where: {
        departure: departure,
        arrival: arrival,
        departure_date: date
      }
    })
    if (!findticket) {
      return res.status(404).json({
        status: "failed",
        message: "either no data or something went wrong"
      })
    }

    res.status(200).josn({
      status: "success",
      message: "Data Success fully fetched",
      resp_object: {
        tickets: findticket
      }
    })

  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    })
  }
}

const userFetchTicketsByLocation = async (req, res) => {
  try {
    console.log('userFetchTicketsByLocation')
    const { loaction } = req.body
    const tickets = await prisma.tickets.findMany({
      where: {
        departure: loaction
      }
    })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json({
      status: "success",
      message: "successfully fetched all tickets by loaction",
      resp_object: {
        tickets
      }
    })
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err
    })
  }
}

const UploadTicket = async (req, res) => {
  try {
    // Extract PDF content
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const allText = pdfData.text;

    // Define the prompt
    const prompt = `
    give me json data from given data. here is the example json format:
    {
        "BookingDetails": {
            "From": "Sindhanur(karnataka)",
            "To": "Hyderabad",
            "BusOperator": "Go Tour Travels and Holidays",
            "TicketNumber": "GT823878",
            "OperatorPNR": "C9VEVJ99",
            "BusType": "A/c-sleeper",
            "BusID": "NU712071099644136",
            "BoardingDateAndTime": "10-Nov-2024 23:20",
            "Passengers": 1,
            "TotalFare": 1600.0
        },
        "PassengerDetails": [
            {
                "SNo": 1,
                "Name": "Ms. Medam Tejaswini",
                "Seat": "A1",
                "SeatType": "Sleeper"
            }
        ],
        "BoardingDropDetails": {
            "BoardingPoint": "P W D Camp (lakshmi Camp)",
            "BoardingPointAddress": "Anand Hegde Petrol Pump, Maski X Roads, Raichur Koppal Road",
            "BoardingPointLandmark": "Na",
            "DropPoint": "Panjagutta",
            "DropPointAddress": "Near Red Rose Restaurant, Metro Pillar No A1127 (No Dinner Break)",
            "DropPointLocation": "Https://Zip.Pr/In/Goto0304",
            "BusOperatorContactNumber": "9900002887, 9483071166, 9483071133"
        },
        "CancellationRules": {
            "CancellationTime": [
                {
                    "Time": "Till on 09 Nov 11:15 PM",
                    "Charges": "Rs. 224.85"
                },
                {
                    "Time": "Between on 09 Nov - on 10 Nov 11:15 AM",
                    "Charges": "Rs. 1124.25"
                },
                {
                    "Time": "Between on 10 Nov - on 10 Nov 11:15 AM",
                    "Charges": "Rs. 1499.0"
                }
            ],
            "Notes": [
                "Above penalty is calculated basis the bus scheduled start time from the first boarding point (starting point of the bus)",
                "The ticket cannot be cancelled after the bus departs from the first boarding point (starting point of the bus)",
                "Cancellation charges shown above may sometimes vary depending on the non-refundable components of the ticket fare defined by the bus operator"
            ],
            "CancellationProcess": [
                "Please go to section of makemytrip.com (Top right corner on website) and proceed to cancel your ticket.",
                "You will be asked to enter booking Id and Contact number.",
                "If you are unable to cancel, Please call us at 0124-462-8765 (Standard Charges Apply) to cancel your e-ticket.",
                "MakeMyTrip would not be able to process refunds for cancellations done directly with the bus operators."
            ],
            "CancellationType": "Partially cancellable"
        }
    }
    Other than this json data no extra text should be generated.
    here is the data from ticket:
    ${allText}`;

    // Call the Google Generative AI API
    const apiKey = process.env.API_KEY;
    const response = await axios.post('https://generativeai.googleapis.com/v1beta3/models/text:generate', {
      prompt: prompt
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse the API response
    const dataResponse = response.data.choices[0].text;
    const jsonString = dataResponse.replace(/```json\n?|```/g, '').trim();
    const parsedData = JSON.parse(jsonString);

    // Send the parsed data
    res.json({ data: parsedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process ticket information.' });
  }

}

const SubmitTicket = async (req, res) => {
  // // to upload ticket
  // // buscomapny,departure,arrival,mustbe,date,time,seatnumber,price,ticketurlconst
  console.log("UserInsertTicket")
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


const userDeleteTicket = async (req, res, next) => {
  // for deleteing uploaded ticket
  // ticketid
  try {
    const { ticketId } = req.body
    const deleteticket = await prisma.tickets.delete({
      where: {
        id: ticketId
      }
    })
    console.log('deleteticket', deleteticket)
    if (deleteticket) {
      res.status(200).json({
        status: "success",
        message: `ticket deleted Successfully with id: ${deleteticket.id}`
      })
    } else {
      res.status(404).json({
        status: "failed",
        message: `failed to deleted ticket  either its not fould or something went wrong`
      })
    }

  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }
}

// const userFetchTicketDetails = (req, res, next) => {
//   // ticketid
// }

const userPurchaseTicket = async (req, res) => {
  // ammount, currency, reciept
  console.log('purchase tickets')
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    })

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      res.status(500).json({
        message: "Error generating order"
      })
    }

    res.status(200).json({
      status: "success",
      message: "Razorpay Order is generated Successfully",
      resp_object: {
        order
      }
    })

  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message
    })
  }
}

const userOrders = async (req, res) => {
  console.log('ordervalidetion')
  const { email } = req.user
  // user id
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    // const Payment = await prisma.transactions.create({
    //   data:{
    //     buyer_id: '',
    //     seller_id: '',
    //     ticket_id: '',
    //     payment_status: 'completed',
    //     payment_intent: razorpay_payment_id
    //   }
    // })

    sendEmail({
      to: email,
      subject: "Transaction Successful",
      text: "We Have Recived Your Payment"
    })

    res.json({
      status: "success",
      message: "transaction successfully completed",
      resp_object: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      }
    });

  } catch (err) {
    res.status(400).josn({
      status: 'failed',
      message: err.message
    })
  }
}



export {
  userRegister,
  userLogin,
  // userLogout,
  // userForgetPassword,
  userFetchAllTickets,
  userFetchTicketsByLocation,
  UploadTicket,
  SubmitTicket,
  userDeleteTicket,
  // userFetchTicketDetails,
  userPurchaseTicket,
  userOrders
}