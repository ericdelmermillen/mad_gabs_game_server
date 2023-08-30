const cors = require('cors');
const cookieSession = require('cookie-session')
const express = require('express');
const passport = require('passport'); 
// const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const app = express();

require('dotenv').config();


app.use(cookieSession(
  {name: "session",
  keys: [process.env.key],
  maxAge: 24 * 60 * 60 * 100})
);

app.use(passport.initialize());
app.use(passport.session());


const usersRouter = require("./routes/users");

const gabsRouter = require("./routes/gabs");

const submitRouter = require("./routes/submit");


app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  // methods: "GET,POST,PUT,DELETE"
  credentials: true
}


app.use(cors(corsOptions));

// require('dotenv').config();


// allows access to built in json parsing method
app.use(express.json());


// Use the routes from auth.js
app.use('/users', usersRouter);

// // Use the routes from gabs.js
app.use('/gabs', gabsRouter);

// Use the routes from submit.js
app.use('/submit', submitRouter);


// *** may want to add /submit/contact in my submit route


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on ${port}`));
