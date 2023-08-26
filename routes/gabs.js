const express = require('express');
const router = express.Router();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

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

router.route('/easy').get(getRandomGab(madGabsPaths.easy));
router.route('/medium').get(getRandomGab(madGabsPaths.medium));
router.route('/hard').get(getRandomGab(madGabsPaths.hard));

module.exports = {
  router,
};
