const express = require('express');
const router = express.Router();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const submitRouter = require('express').Router();


submitRouter.route('/gab')
  .post((req, res) => {
    console.log("from submit")
    const submitted_gab_question = req.body.submitted_gab_question; 
    const submitted_gab_answer = req.body.submitted_gab_answer; 
    res.json({ success: true, submitted_gab_question: `Submitted Gab Question: ${submitted_gab_question}. Submitted Gab Question: ${submitted_gab_answer}` });
});


module.exports = submitRouter;