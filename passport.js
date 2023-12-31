const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/auth/google/callback", proxy: true
      callbackURL: "https://mad-gabs-server-19e85a1994cd.herokuapp.com/auth/google/callback", proxy: true
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);
    

// FACEBOOK_APP_ID = "your id";
// FACEBOOK_APP_SECRET = "your id";

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});