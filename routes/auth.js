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

// *** user email signup path begins
router.post("/user/signup", async (req, res) => { // Make the route handler async

  if (!req.body.email || !req.body.password) {
    return res.status(401).json({
      message: "Missing email or password"
    });
  }

  try {
    const data = await fs.promises.readFile(userDataFilePath, 'utf8'); 

    const userData = JSON.parse(data);

    // Check if the user with the provided email already exists
    const userExists = userData.some((user) => user.email === req.body.email);

    if (userExists) {
      // User with that email already exists, send a "user exists" message
      return res.status(409).json({
        success: false,
        message: "User with that email already exists",
      });
    }

    const newUser = {
      mgUserId: userData.length + 1,
      userName: null,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10), 
      googleId: null,
      facebookId: null,
      totalPoints: 0,
    };

    const token = getToken(newUser);

    userData.push(newUser);

    await fs.promises.writeFile(userDataFilePath, JSON.stringify(userData, null, 2));

    res.json({
      success: true,
      message: "User created successfully",
      user: newUser,
      token: token
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Failed to update user data" });
  }
});


// *** user email login path begins
router.post("/user/login", (req, res) => {

  if (!req.body.email || !req.body.password) {
    return res.status(401).json({
      message: "Missing email or password",
    });
  }

  // Read the user data from the JSON file
  fs.readFile(userDataFilePath, 'utf8', async (readErr, data) => {

    if (readErr) {
      console.error('Error reading user data:', readErr);
      return res.status(500).json({ error: "Failed to read user data" });
    }

    const userData = JSON.parse(data);

    // Check if the user with the provided email exists
    const matchedUser = userData.find((user) => user.email === req.body.email);

    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        message: "User with that email not found",
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(req.body.password, matchedUser.password);

    if (!passwordMatch) {
      // Passwords do not match, send an "incorrect password" message
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const matchedUserRank = [...userData]
      .sort((x, y) => y.totalPoints - x.totalPoints)
      .findIndex((user) => user.email === matchedUser.email);

    const user = {};
    user.mgUserId = matchedUser.mgUserId;
    user.totalPoints = matchedUser.totalPoints;
    user.userName = matchedUser.userName;
    user.ranking = { userRank: matchedUserRank + 1, totalPlayers: userData.length };
    const token = getToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: user,
      token: token
    });
  });
});


// *** google success path begins
router.get("/login/success", (req, res) => {
  if (req.user) {

    console.log("from /login/success")

    fs.readFile(userDataFilePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error('Error reading user data:', readErr);
        return res.status(500).json({ error: "Failed to read user data" });
      }

      const userData = JSON.parse(data);

      const userExists = userData.some((user) => user.googleId == req.user.id);
  
      if (!userExists) {
        const newUser = {
          mgUserId: userData.length +1,
          userName: null, 
          email: null,
          password: null,
          googleId: req.user.id,
          facebookId: null,
          totalPoints: 0,
        };

        userData.push(newUser);

        fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing user data:', writeErr);
            return res.status(500).json({ error: "Failed to update user data" });
          }

          const token = getToken(newUser);

          res.json({
            success: true,
            message: "Logged in successfully",
            user: newUser,
            token: token
          });
        });
        } else {
          const matchedUser = userData.find((user) => user.googleId === req.user.id);

        const matchedUserRank = [...userData]
          .sort((x, y) =>  y.totalPoints - x.totalPoints)
          .findIndex((user) => user.googleId === matchedUser.googleId);

          user = {};
          user.mgUserId = matchedUser.mgUserId;
          user.totalPoints = matchedUser.totalPoints;
          user.userName = matchedUser.userName;
          user.ranking = { userRank: matchedUserRank + 1, totalPlayers: userData.length };
          
        const token = getToken(user);

        res.json({
          success: true,
          message: "Login successful",
          token: token,
          user: user,
        });
      }
    });
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