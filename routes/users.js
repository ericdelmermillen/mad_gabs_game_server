const fs = require('fs');
const path = require('path');
const usersController = require("../controllers/users_controller");
// const { promisify } = require('util');

const usersRouter = require('express').Router();

const { getPoints } = require('../utils/utilFunctions.js');

usersRouter.
  get("/", (req, res) => {
    res.status(200).json({
      message: "yo from users",
  })
});

usersRouter.post("/username", (req, res) => {
  // Use 'path' to construct file paths
  const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');

  fs.readFile(userDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const userData = JSON.parse(data);

    const matchedUser = userData.find((user) => user.mGUserId === req.body.mGUserId);

    const matchedUserRank = userData
      .sort((x, y) =>  y.totalPoints - x.totalPoints)
      .findIndex((user) => user.mGUserId === req.body.mGUserId);

    res.user = {};
    res.user.mGUserId = matchedUser.mGUserId;
    res.user.totalPoints = matchedUser.totalPoints;
    res.user.userName = req.body.userName;
    res.user.ranking = { userRank: matchedUserRank + 1, totalPlayers: userData.length };

    res.json({
      success: true,
      message: "successful",
      user: res.user,
    });
  });
});






usersRouter.
  post('/post-points',(req, res) => {

  /*
  --request needs to arrive with mgUserId, 
  --need to authenticate the user's jwt
  --
    
  */


    const points = getPoints(req.body.secondsRemaining);

    
    if (points !== null) {
      res.status(200).json({ points });
    } else {
      res.status(500).json({ error: "Failed to fetch points" });
    }
});


module.exports = usersRouter;