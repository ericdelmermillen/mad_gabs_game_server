const fs = require('fs');
const usersController = require("../controllers/users_controller");
const { promisify } = require('util');

const usersRouter = require('express').Router();

const { getPoints } = require('../utils/utilFunctions.js');

usersRouter.
get("/", (req, res) => {
    res.status(200).json({
      message: "yo from users",
  })
});


usersRouter.
  // route('/postpoints')
  post('/post-points',(req, res) => {
    const points = getPoints(req.body.secondsRemaining);

    
    if (points !== null) {
      res.status(200).json({ points });
    } else {
      res.status(500).json({ error: "Failed to fetch points" });
    }
});


module.exports = usersRouter;