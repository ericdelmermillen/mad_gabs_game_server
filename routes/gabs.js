const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require("knex")(require("../knexfile"));
const gabsRouter = express.Router();


gabsRouter.route('/').get((req, res) => {

  if(!req.headers.authorization) {
    console.log("no token!")
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  } 

  const token = req.headers.authorization.split(" ")[1]; 

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {  
    if (err) {
      console.log("Invalid token!");
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    knex("gabs")
    .select("*")
    .where({ level: req.query.level })
    .then((gabs) => {
      if (gabs.length === 0) {
        return res.status(404).json(`No ${req.query.level} gabs found`);
      }
  
    const randomIndex = Math.floor(Math.random() * gabs.length);
    const gabData = gabs[randomIndex];

    res.status(200).json(gabData); 
  })
  .catch(() => {
    res.status(500).send("Server Error getting gabs data.");
    })
  })
});


module.exports = gabsRouter;