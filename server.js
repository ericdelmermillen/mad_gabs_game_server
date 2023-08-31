const cookieSession = require("cookie-session");
const express = require('express');
const cors = require('cors');
const passportSetup = require("./passport")
const passport = require('passport'); 

const authRoute = require("./routes/auth"); // change this path after 

const gabsRouter = require("./routes/gabs");

const submitRouter = require("./routes/submit");
 
const app = express();

require('dotenv').config();

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions));


// allows access to built in json parsing method
app.use(express.json());


// Use the routes from auth.js
app.use('/auth', authRoute);

// // Use the routes from gabs.js
app.use('/gabs', gabsRouter);

// Use the routes from submit.js
app.use('/submit', submitRouter);


// *** may want to add /submit/contact in my submit route


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on ${port}`));
