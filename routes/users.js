const fs = require('fs');
const path = require('path');
const usersController = require("../controllers/users_controller");

const usersRouter = require('express').Router();

const { getPoints } = require('../utils/utilFunctions.js');

usersRouter.
  get("/", (req, res) => {
    res.status(200).json({
      message: "yo from users",
  })
});

usersRouter.post("/username", (req, res) => {
  const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');
  console.log("from userName")

  // console.log(req.headers)

  // console.log("headers.authorization: ", req.headers.authorization.split(" "))

  // validate jwt; if not valid  

  fs.readFile(userDataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(req.body.mgUserId)

    const userData = JSON.parse(data);

    const matchedUser = userData.find((user) => user.mgUserId === req.body.mgUserId);

    const matchedUserRank = [...userData]
      .sort((x, y) =>  y.totalPoints - x.totalPoints)
      .findIndex((user) => user.mgUserId === req.body.mgUserId);

    matchedUser.userName = req.body.userName;

    fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return;
      }

      res.user = {};
      res.user.mgUserId = matchedUser.mgUserId;
      res.user.totalPoints = matchedUser.totalPoints;
      res.user.userName = matchedUser.userName;
      res.user.ranking = { userRank: matchedUserRank + 1, totalPlayers: userData.length };

      res.json({
        success: true,
        message: "Username updated successfully",
        user: res.user,
      });
    });
  });
});


usersRouter.post('/post-points', (req, res) => {
  const mgUserId = req.body.mgUserId;
  const secondsRemaining = req.body.secondsRemaining;

  if (!mgUserId || secondsRemaining === undefined) {
    return res.status(400).json({ error: "Bad request. Please provide mgUserId and secondsRemaining." });
  }

  const points = getPoints(secondsRemaining);

  if (points !== null) {
    const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');

    fs.readFile(userDataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to read user data" });
      }

      const userData = JSON.parse(data);

      const matchedUser = userData.find((user) => user.mgUserId === mgUserId);

      if (!matchedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      matchedUser.totalPoints += points;

      fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).json({ error: "Failed to update user points" });
        }

        // Respond with the updated user data
        const matchedUserRank = userData
          .sort((x, y) =>  y.totalPoints - x.totalPoints)
          .findIndex((user) => user.mgUserId === mgUserId);

        res.json({
          success: true,
          message: "Points updated successfully",
          user: {
            mgUserId: matchedUser.mgUserId,
            totalPoints: matchedUser.totalPoints,
            userName: matchedUser.userName,
            points: points,
            ranking: { userRank: matchedUserRank + 1, totalPlayers: userData.length },
            
          },
        });
      });
    });
  } else {
    res.status(500).json({ error: "Failed to fetch points" });
  }
});

module.exports = usersRouter;