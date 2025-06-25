import express from 'express'
import { userRegister, userLogin, userFetchAllTickets, userFetchTicketsByLocation, UploadTicket, SubmitTicket, userDeleteTicket, userPurchaseTicket, userOrders } from '../controllers/userController.js'
import { ForgetPassword, resetPasswordForm, resetPassword } from '../controllers/adminController.js'
import { registerInputValidator, loginInputValidator, forgetPasswordInputValidator, fetchAllTicketInputValidator, uploadTicketInputValidator, purchaseTicketInputValidator, validatePurchaseTicketInputValidator } from '../utills/validators/userValidators.js'
import { validateInput } from '../middlewares/inputValidator.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
import multer from 'multer';



const userRouter = express.Router()
const upload = multer()

userRouter.post('/register', validateInput(registerInputValidator), userRegister)
userRouter.post('/login', validateInput(loginInputValidator), userLogin)
// userRouter.post('/loginout', validateInput(logoutInputValidator), userLogout)
userRouter.post('/forgetpassword', validateInput(forgetPasswordInputValidator), ForgetPassword)
userRouter.get('/reset-password/:id/:token', resetPasswordForm)
userRouter.post('/reset-password/:id/:token', resetPassword)
userRouter.post('ticket/all', validateInput(fetchAllTicketInputValidator), authenticateToken, userFetchAllTickets)
userRouter.get('/ticket/loaction', authenticateToken, userFetchTicketsByLocation)
userRouter.post('/ticket/upload', upload.single('file'), authenticateToken, UploadTicket)
userRouter.post('/ticket/submit', validateInput(uploadTicketInputValidator), authenticateToken, SubmitTicket)
// userRouter.post('/uploadticket', userUploadTicket)
userRouter.post('/ticket/delete', authenticateToken, userDeleteTicket)
// userRouter.post('/tikectdetails', authenticateToken, userFetchTicketDetails)
userRouter.post('/order', validateInput(purchaseTicketInputValidator), authenticateToken, userPurchaseTicket)
userRouter.post('/order/validate', validateInput(validatePurchaseTicketInputValidator), authenticateToken, userOrders)


export default userRouter