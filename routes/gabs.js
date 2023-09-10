const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const gabsController = require("../controllers/gabs_controller");
const gabsRouter = require('express').Router();
const router = express.Router();
const jwt = require('jsonwebtoken');

gabsRouter.route('/').get(gabsController);

// router.route('/submit')
//   .post((req, res) => {

//     console.log("From submit")


//   if(!req.headers.authorization) {
//     console.log("no token!")
//     return res.status(401).json({ message: 'Unauthorized - No token provided' });
//   } 
//     const token = req.headers.authorization.split(" ")[1];

//     console.log("Token: ", token)


//     const submitted_gab_question = req.body.submitted_gab_question; 
//     const submitted_gab_answer = req.body.submitted_gab_answer; 
//     res.json({ success: true, submitted_gab_question: `Submitted Gab Question: ${submitted_gab_question}. Submitted Gab Question: ${submitted_gab_answer}` });
// });

module.exports = gabsRouter;
