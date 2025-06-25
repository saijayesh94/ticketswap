import express from "express";
import { AdminRegister, AdminLogin, ForgetPassword, resetPasswordForm, resetPassword, AdminFetchAllTickets, AdminInsertTicket, AdminFetchAllTransaction, } from "../controllers/adminController.js";
import { validateInput } from "../middlewares/inputValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { registerInputValidator, loginInputValidator, forgetPasswordInputValidator, uploadTicketInputValidator } from "../utills/validators/userValidators.js";

const adminRouter = express.Router()

adminRouter.post('/register', validateInput(registerInputValidator), AdminRegister)
adminRouter.post('/login', validateInput(loginInputValidator), AdminLogin)
// adminRouter.post('/logout', validateInput(logoutInputValidator), AdminLogout)
adminRouter.post('/forgetpassword', validateInput(forgetPasswordInputValidator), ForgetPassword)
adminRouter.get('/reset-password/:id/:token', resetPasswordForm)
adminRouter.post('/reset-password/:id/:token', resetPassword)
adminRouter.get('/allticket', authenticateToken, AdminFetchAllTickets)
adminRouter.post('/ticket', validateInput(uploadTicketInputValidator), authenticateToken, AdminInsertTicket)
adminRouter.get('/alltransation', authenticateToken, AdminFetchAllTransaction)


export default adminRouter