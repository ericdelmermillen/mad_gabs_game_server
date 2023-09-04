const fs = require('fs');
const path = require('path');
const router = require("express").Router();

const userDataFilePath = path.join(__dirname, '../usersData/usersData.json');

const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";


// user email signup path
router.post("/user", (req, res) => {

  if(!req.body.email || !req.body.password) {
    return res.status(401).json({
      message: "failure"
    });
  }
  // req.user needs to be what is retrieved by the DB
  req.user = {},
  // req.user.userName = "generic3ric",
  req.user.userName = null,
  req.user.totalPoints = 0,
  req.user.ranking = {userRank: 69, totalPlayers: 69},
  
  res.json({
    success: true,
    message: "successfull",
    user: req.user,
    cookies: req.cookies
  });
});


// *** user email signin path begins
router.post("/user", (req, res) => {

  if(!req.body.email || !req.body.password) {
    return res.status(401).json({
      message: "failure"
    });
  }
  // req.user needs to be what is retrieved by the DB
  req.user = {},
  // req.user.userName = "generic3ric",
  req.user.userName = null,
  req.user.totalPoints = 0,
  req.user.ranking = {userRank: 69, totalPlayers: 69},
  
  res.json({
    success: true,
    message: "successfull",
    user: req.user,
    cookies: req.cookies
  });
});
// *** user email signin path ends


// *** google success path begins
router.get("/login/success", (req, res) => {
  if (req.user) {

    fs.readFile(userDataFilePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error('Error reading user data:', readErr);
        return res.status(500).json({ error: "Failed to read user data" });
      }

      const userData = JSON.parse(data);

      const userExists = userData.some((user) => user.googleId == req.user.id);
  
      if (!userExists) {
        const newUser = {
          mGUserId: userData.length +1,
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

          res.json({
            success: true,
            message: "User created successfully",
            user: newUser
          });
          console.log(res.json)
        });
        } else {
          const matchedUser = userData.find((user) => user.googleId === req.user.id);

        const matchedUserRank = [...userData]
          .sort((x, y) =>  y.totalPoints - x.totalPoints)
          .findIndex((user) => user.googleId === matchedUser.googleId);

        res.user = {};
        res.user.mGUserId = matchedUser.mGUserId;
        res.user.totalPoints = matchedUser.totalPoints;
        res.user.userName = matchedUser.userName;
        res.user.ranking = { userRank: matchedUserRank + 1, totalPlayers: userData.length };

        res.json({
          success: true,
          message: "Login successful",
          user: res.user,
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


router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router