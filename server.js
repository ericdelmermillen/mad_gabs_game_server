const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");

const authRoute = require("./routes/auth");
const gabsRouter = require("./routes/gabs");
const submitRouter = require("./routes/submit");
const usersRouter = require("./routes/users");

const app = express();

require('dotenv').config();

app.use(
  cookieSession({ name: "session", keys: ["Eric"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", usersRouter);
app.use('/gabs', gabsRouter);
app.use('/submit', submitRouter);


// const port = process.env.PORT;
const port = 5000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
