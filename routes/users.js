const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const knex = require("knex")(require("../knexfile"));

const { getPoints } = require('../utils/utilFunctions.js');

// set userName path
usersRouter.post("/username", async (req, res) => {
  const { mgUserId, userName} = req.body;

  if (!mgUserId || !userName) {
    return res.status(400).json({ error: "Bad request. Please provide mgUserId and userName." });
  }
  
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }

      try {
        const usernameExists = await knex('users')
        .where('userName', userName)
        .whereNot('mgUserId', mgUserId)
        .first();

      if (usernameExists) {
        return res.status(409).json({ error: 'Username is already taken' });
      }

        const updatedUser = await knex('users')
          .where('mgUserId', mgUserId)
          .update({ userName });

        if (updatedUser) {
          const [user] = await knex('users')
            .select('mgUserId', 'totalPoints', 'userName')
            .where('mgUserId', mgUserId);

          const usersDotLength = await knex("users");

          const matchedUserRank = usersDotLength
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .findIndex(searchedUser => searchedUser.mgUserId === mgUserId);

          user.ranking = {
            userRank: user.totalPoints > 0 
              ? matchedUserRank + 1
              : usersDotLength.length,
            totalPlayers: usersDotLength.length
          };

          res.json({
            success: true,
            message: "Username updated successfully",
            user,
          });
        } else {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: "Failed to update username" });
      }
    });
  }
});

usersRouter.post('/post-points', async (req, res) => {
  const { mgUserId, secondsRemaining } = req.body;

  if (!mgUserId || !secondsRemaining) {
    return res.status(400).json({ error: "Bad request. Please provide mgUserId and secondsRemaining." });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Invalid token!");
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    try {
      const points = getPoints(secondsRemaining);

      if (points === null) {
        return res.status(500).json({ error: "Failed to fetch points" });
      }

      const user = await knex('users').where('mgUserId', mgUserId).first();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.totalPoints += points;

      await knex('users').where('mgUserId', mgUserId).update({ totalPoints: user.totalPoints });

      const [userData] = await knex('users').select('mgUserId', 'totalPoints', 'userName').where('mgUserId', mgUserId);

      const usersDotLength = await knex("users");

      const matchedUserRank = usersDotLength
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .findIndex(searchedUser => searchedUser.mgUserId === mgUserId);

      userData.ranking = {
        userRank: userData.totalPoints > 0 
          ? matchedUserRank + 1
          : usersDotLength.length,
        totalPlayers: usersDotLength.length
      };

      userData.points = points;

      res.json({
        success: true,
        message: "Points updated successfully",
        user: userData,
        points,
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Failed to update points" });
    }
  });
});


module.exports = usersRouter;