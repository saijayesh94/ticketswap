import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import generateToken from '../utills/generateToken.js';
import prisma from './prisma.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Code to handle user authentication and retrieval
      try {
        // Check if user already exists
        let user = await prisma.users.findUnique({
          where: { email: profile?._json?.email }
        });
        // If not, create a new user
        if (!user) {
          user = await prisma.users.create({
            data: {
              name: profile?._json?.name,
              email: profile?._json?.email,
              googleId: profile?._json?.sub,
              admin: false, // set as needed
            }
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);



passport.serializeUser(function (user, done) {
  done(null, user)
})


passport.deserializeUser(async function (user, done) {
  // const user = await prisma.users.findUnique({ where: { id } });
  done(null, user);
})

export default passport
