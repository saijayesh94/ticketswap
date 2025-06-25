import express from "express";
import cors from 'cors'
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoute.js";
import session from "express-session"
import passport from "passport"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extented: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(session({ secret: '#$%^&*($%^&*I', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.use('/admin', adminRouter)
app.use('/api/v1', userRouter)
app.use('/api/v1', authRouter)



export default app;