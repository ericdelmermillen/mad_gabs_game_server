const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const routes = require("./routes/gabs").router; 


const app = express();
 
const corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(express.json());

app.use(cors(corsOptions));

require('dotenv').config();

// Allow access to assets folder: probaly don't need this
app.use(express.static('./assets'));

// allows access to built in json parsing method
app.use(express.json());


// Routes:
app.use('/', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on ${port}`));
