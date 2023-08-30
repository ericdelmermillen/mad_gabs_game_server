const cors = require('cors');
const express = require('express');
const passport = require('passport'); 
// const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const app = express();
const fs = require('fs');

// const authRouter = require("./routes/auth")

const gabsRouter = require("./routes/gabs")

const submitRouter = require("./routes/submit")


app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000'
}


app.use(cors(corsOptions));

require('dotenv').config();


// allows access to built in json parsing method
app.use(express.json());


// Use the routes from auth.js
// app.use('/auth', authRouter);

// // Use the routes from gabs.js
app.use('/gabs', gabsRouter);

// Use the routes from submit.js
app.use('/submit', submitRouter);

// *** may want to add /submit/contact in my submit route


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on ${port}`));
