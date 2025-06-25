import express from "express";
import passport from "../config/passportConfig.js"
const authRouter = express.Router()
import generateToken from "../utills/generateToken.js";

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }), async (req, res) => {
  // Generate a token for the authenticated user
  const user = await req.user
  const token = generateToken({ id: user.id, email: user.email });
  res.redirect(`http://localhost:5173/success?token=${token}`);
});


export default authRouter