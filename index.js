const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const routes = require("./routes/gabs").router; 

// console.log("index")

const app = express();
 
const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(express.json());
app.use(cors(corsOptions));

require('dotenv').config();

// Allow access to assets folder
app.use(express.static('./assets'));

// allows access to built in json parsing method
app.use(express.json());


// const videosFilePath = './data/videos.json';
const madGabsEasyPath = './data/madGabsEasy.json';


// Routes:
app.use('/', routes);

const port = process.env.PORT || 8088;

app.listen(port, () => console.log(`Listening on ${port}`));
