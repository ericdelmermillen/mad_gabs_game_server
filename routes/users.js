const fs = require('fs');
const path = require('path');
const usersRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const knex = require("knex")(require("../knexfile"));

const { getPoints } = require('../utils/utilFunctions.js');

// users/username path begins *** mysql
usersRouter.post("/username", async (req, res) => {
  const userName = req.body.userName;
  const mgUserId = req.body.mgUserId;

  try {
    const updatedUser = await knex('users')
      .where('mgUserId', mgUserId)
      .update({ userName });

    if (updatedUser) {
      const [user] = await knex('users')
        .select('mgUserId', 'totalPoints', 'userName')
        .where('mgUserId', mgUserId);

      const usersDotLength = await knex("users");

      const matchedUserRank = await knex('users')
        .count('*')
        .where('totalPoints', '>', user.totalPoints);

      user.ranking = {
        userRank: matchedUserRank[0]['count(*)'] + 1,
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

// /post-points *** mysql
usersRouter.post('/post-points', async (req, res) => {
  const mgUserId = req.body.mgUserId;
  const secondsRemaining = req.body.secondsRemaining;
  // console.log("req.body: ", req.body)

  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!mgUserId || secondsRemaining === undefined) {
      return res.status(400).json({ error: "Bad request. Please provide mgUserId and secondsRemaining." });
    }

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

    const matchedUserRank = await knex('users')
      .count('*')
      .where('totalPoints', '>', userData.totalPoints);

    userData.ranking = {
      userRank: matchedUserRank[0]['count(*)'] + 1,
      totalPlayers: matchedUserRank[0]['count(*)'] + 1
    };

    res.json({
      success: true,
      message: "Points updated successfully",
      user: userData,
      points,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
});


// // post-points begins
// usersRouter.post('/post-points', (req, res) => {
//   const mgUserId = req.body.mgUserId;
//   const secondsRemaining = req.body.secondsRemaining;

//   if (!req.headers.authorization) {
//     return res.status(401).json({ message: 'Unauthorized - No token provided' });
//   } else {

//     const token = req.headers.authorization.split(" ")[1];
    
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log("Invalid token!");
//         return res.status(401).json({ message: 'Unauthorized - Invalid token' });
//       } else if (!mgUserId || secondsRemaining === undefined) {
//         return res.status(400).json({ error: "Bad request. Please provide mgUserId and secondsRemaining." });
//       } 
      
//       const points = getPoints(secondsRemaining);
      
//       if (points !== null) {
//         const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');
        
//         fs.readFile(userDataFilePath, 'utf8', (err, data) => {
//           if (err) {
//             console.error(err);
//             return res.status(500).json({ error: "Failed to read user data" });
//           }
          
//           const userData = JSON.parse(data);
//           const matchedUser = userData.find((user) => user.mgUserId === mgUserId);
          
//           if (!matchedUser) {
//             return res.status(404).json({ error: "User not found" });
//           }
          
//           matchedUser.totalPoints += points;
          
//           fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), (writeErr) => {
//             if (writeErr) {
//               console.error(writeErr);
//               return res.status(500).json({ error: "Failed to update user points" });
//             }
            
//             const matchedUserRank = userData
//             .sort((x, y) => y.totalPoints - x.totalPoints)
//             .findIndex((user) => user.mgUserId === mgUserId);
            
//             res.json({
//               success: true,
//               message: "Points updated successfully",
//               user: {
//                 mgUserId: matchedUser.mgUserId,
//                 totalPoints: matchedUser.totalPoints,
//                 userName: matchedUser.userName,
//                 points: points,
//                 ranking: { userRank: matchedUserRank + 1, totalPlayers: userData.length },
//               },
//             });
//           });
//         });
//       } else {
//         res.status(500).json({ error: "Failed to fetch points" });
//       }
//     });
//   }
// });

module.exports = usersRouter;