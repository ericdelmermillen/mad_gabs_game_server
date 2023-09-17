const fs = require('fs');
// const path = require('path');
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const knex = require("knex")(require("../knexfile"));

const passport = require("passport");

// const CLIENT_URL = "http://localhost:3000/";
const CLIENT_URL = process.env.CLIENT_URL;

const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1m' })
}

// email signup path
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

    const newUser = {
      userName: null,
      email: email,
      password: await bcrypt.hash(password, 10), 
      googleId: null,
      facebookId: null,
      totalPoints: 0
    };

    const [ mgUserId ] = await knex('users').insert(newUser);

    const user = { mgUserId, ...newUser };

    const usersDotLength = await knex("users");
    
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

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const matchedUser = await knex('users').where({ email }).first();
    const usersDotLength = await knex("users");

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

    const matchedUserRank = usersDotLength
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .findIndex(user => user.mgUserId === matchedUser.mgUserId);

    const user = {};
    user.mgUserId = matchedUser.mgUserId;
    user.totalPoints = matchedUser.totalPoints;
    user.userName = matchedUser.userName;
    user.ranking = {
      userRank: matchedUser.totalPoints > 0 
        ? matchedUserRank + 1
        : usersDotLength.length,
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

// google sso path
router.get("/login/success", async (req, res) => {
  if (req.user) {
    try {
      const userData = await knex('users')
        .where('googleId', req.user.id)
        .first();

      const usersDotLength = await knex('users');
        
      if (!userData) {
        const newUser = {
          userName: null,
          email: null,
          password: null,
          googleId: req.user.id,
          facebookId: null,
          totalPoints: 0,
        };
          
        const [ mgUserId ] = await knex('users').insert(newUser);

        newUser.mgUserId = mgUserId;

        const token = getToken(newUser);

        res.json({
          success: true,
          message: "Logged in successfully",
          user: newUser,
          token: token
        });
      } else {

        const user = {
          mgUserId: userData.mgUserId,
          totalPoints: userData.totalPoints,
          userName: userData.userName
        };

        const matchedUserRank = usersDotLength
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .findIndex(searchedUser => searchedUser.mgUserId === user.mgUserId);

        user.ranking = {
          userRank: user.totalPoints > 0 
            ? matchedUserRank + 1
            : usersDotLength.length,
          totalPlayers: usersDotLength.length
        }
        
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


// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

module.exports = router;