const fs = require('fs');
const path = require('path');
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require("knex")(require("../knexfile"));

const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');

const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";

const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' })
}

// user email signup path begins *** mySQL
router.post("/user/signup", async (req, res) => { 
  const { email, password } = req.body;

  try {
    const userExists = await knex('users').where({ email }).first();
    
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with that email already exists",
      });
    }
    
    const usersDotLength = await knex("users");

    const newUser = {
      userName: null,
      email: email,
      password: await bcrypt.hash(password, 10), 
      googleId: null,
      facebookId: null,
      totalPoints: 0
    };

    const [mgUserId] = await knex('users').insert(newUser);

    const user = { mgUserId, ...newUser };
    
    user.ranking = {
      userRank: usersDotLength.length,
      totalPlayers: usersDotLength.length
      }

    const token = getToken(user);

    res.json({
      success: true,
      message: "User created successfully",
      user: user,
      token: token
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// *** user email login path begins *** MySQL
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const matchedUser = await knex('users').where({ email }).first();
    const usersDotLength = await knex("users");
    console.log("usersDotLength: ", usersDotLength)

    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        message: "User with that email not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, matchedUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const matchedUserRank = await knex('users')
      .count('*')
      .where('totalPoints', '>', matchedUser.totalPoints)
      .first();

    const user = {};
    user.mgUserId = matchedUser.mgUserId;
    user.totalPoints = matchedUser.totalPoints;
    user.userName = matchedUser.userName;
    user.ranking = {
      userRank: matchedUserRank.count + 1,
      totalPlayers: usersDotLength.length
      };
    
    const token = getToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: user,
      token: token
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "An error occurred while logging in" });
  }
});

// google sso path *** mysql
router.get("/login/success", async (req, res) => {
  if (req.user) {
    try {
      const userData = await knex('users')
        .where('googleId', req.user.id)
        .first();

      const usersDotLength = await knex("users");

      if (!userData) {
        const newUser = {
          userName: null,
          email: null,
          password: null,
          googleId: req.user.id,
          facebookId: null,
          totalPoints: 0,
          ranking: {
            userRank: matchedUserRank[0]['count(*)'] + 1,
            totalPlayers: usersDotLength.length
          }
        };

        const [mgUserId] = await knex('users').insert(newUser);
        newUser.mgUserId = mgUserId;

        const token = getToken(newUser);

        res.json({
          success: true,
          message: "Logged in successfully",
          user: newUser,
          token: token
        });
      } else {
        const matchedUserRank = await knex('users')
          .count('*')
          .where('totalPoints', '>', userData.totalPoints);

        const user = {
          mgUserId: userData.mgUserId,
          totalPoints: userData.totalPoints,
          userName: userData.userName,
          ranking: {
            userRank: matchedUserRank[0]['count(*)'] + 1,
            totalPlayers: usersDotLength.length
          }
        };
        
        
        const token = getToken(user);

        res.json({
          success: true,
          message: "Login successful",
          token: token,
          user: user,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: "Failed to update user data" });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "Unsuccessful",
    });
    console.log("Oh no");
  }
});

router.get("/logout", (req, res) => {
  // delete jwt on logout from session storage
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
// *** google sso ends


// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

module.exports = router