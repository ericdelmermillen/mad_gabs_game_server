require('dotenv').config();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    // function (accessToken, refreshToken, profile, cb) {
    //   Usser.findOrCreate({ googleID: profile.id}, function (err, user) {
    //     return cb(err, user)
    //   })
    }
  ));



// const GOOGLE_CLIENT_ID = env.process.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_ID = env.process.GOOGLE_CLIENT_SECRET

const GOOGLE_CLIENT_ID = "614954374727-55n61iodkc61nkdpmcrbm640fl9utafq.apps.googleusercontent.com";

const GOOGLE_CLIENT_SECRET = "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"




console.log(GOOGLE_CLIENT_ID)