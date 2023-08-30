const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const gabsController = require("../controllers/gabs_controller");
const gabsRouter = require('express').Router();
const router = express.Router();

function getRandomGab(path) {
  return async (req, res) => {
    try {
      const data = await readFileAsync(path);
      const gabArray = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * gabArray.length);
      const randomGab = gabArray[randomIndex];
      res.json(randomGab);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
}

gabsRouter.route('/').get(gabsController);
gabsRouter.route('/').post(gabsController);
// gabsRouter.route('/hard').get(gabsController);

// gabsRouter.route('/').post(getRandomGab(gabsController.easy));
// gabsRouter.route('/medium').get(getRandomGab(madGabsPaths.medium));
// gabsRouter.route('/hard').get(getRandomGab(madGabsPaths.hard));


router.route('/submit')
  .post((req, res) => {
    console.log("from gab")
    const submitted_gab_question = req.body.submitted_gab_question; 
    const submitted_gab_answer = req.body.submitted_gab_answer; 
    res.json({ success: true, submitted_gab_question: `Submitted Gab Question: ${submitted_gab_question}. Submitted Gab Question: ${submitted_gab_answer}` });
});


module.exports = gabsRouter;
