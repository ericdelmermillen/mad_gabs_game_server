const cookieSession = require("cookie-session");
const express = require("express");
const proxy = require("proxy-addr");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");

const authRoute = require("./routes/auth");
const gabsRouter = require("./routes/gabs");
const submitRouter = require("./routes/submit");
const usersRouter = require("./routes/users");

const app = express();
app.set("trust proxy", true);

require('dotenv').config();

// google sso cookie
// app.use(
//   cookieSession({ name: "session", keys: [process.env.KEY], maxAge: 24 * 60 * 60 * 100 })
// );


// google sso cookie
app.use(
  cookieSession({ 
    name: "session", 
    keys: [process.env.KEY], 
    maxAge: 24 * 60 * 60 * 100, 
    secure: true,
    sameSite: 'none' 
  })
);

app.use(passport.initialize());
app.use(passport.session());

// const corsOptions = {
//   origin: process.env.ORIGIN,
//   credentials: true
// }

const corsOptions = {
  origin: "https://main--stellar-marshmallow-22640e.netlify.app",
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoute);
app.use('/gabs', gabsRouter);
app.use("/users", usersRouter);
app.use('/submit', submitRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
