const express = require('express');
const router = express.Router();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const gabsRouter = require('express').Router();

const madGabsPaths = {
  easy: './data/madGabsEasy.json',
  medium: './data/madGabsMedium.json',
  hard: './data/madGabsHard.json',
};

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

// router.route('/easy').get(getRandomGab(madGabsPaths.easy));
// router.route('/medium').get(getRandomGab(madGabsPaths.medium));
// router.route('/hard').get(getRandomGab(madGabsPaths.hard));


gabsRouter.route('/easy').get(getRandomGab(madGabsPaths.easy));
gabsRouter.route('/medium').get(getRandomGab(madGabsPaths.medium));
gabsRouter.route('/hard').get(getRandomGab(madGabsPaths.hard));


router.route('/submit')
  .post((req, res) => {
    console.log("from gab")
    const submitted_gab_question = req.body.submitted_gab_question; 
    const submitted_gab_answer = req.body.submitted_gab_answer; 
    res.json({ success: true, submitted_gab_question: `Submitted Gab Question: ${submitted_gab_question}. Submitted Gab Question: ${submitted_gab_answer}` });
});


// module.exports = router;
module.exports = gabsRouter;
