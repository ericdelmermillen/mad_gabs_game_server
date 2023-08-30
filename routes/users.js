const express = require('express');
const fs = require('fs');
const usersController = require("../controllers/users_controller");
const { promisify } = require('util');

const usersRouter = require('express').Router();
const router = express.Router();


// authRouter.
//   get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// authRouter.
//   get('/google/redirect', passport.authenticate('google', { session: false, failureRedirect: `https://localhost:3000/login` }), (req, res) => {
//   res.redirect(req.user); //req.user has the redirection_url
// });


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

module.exports = usersRouter;