const router = require("express").Router();
const passport = require("passport");

// 
const fs = require('fs');
// 

const CLIENT_URL = "http://localhost:3000/";

// 
const userDataFilePath = "./usersData/usersData.json";
// 

// google success path
router.get("/login/success", (req, res) => {
  if (req.user) {


  console.log(req.user)
/*

--need to give user a jwt; create it and send in the response 

--check database to see if user exists (find by google id)

--need to get data from database and attach it to req.user: needs userName, totalPoints, ranking, mgUserId

*/
    req.user.userName = "genericEric",
    req.user.totalPoints = 1000,
    req.user.ranking = {userRank: 7, totalPlayers: 11},
    req.user.mgdbNum = 1;
    //
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies
    });
    console.log(req.user)
  } else {
    res.status(404).json({
      success: "false",
      message: "unsuccessfull",
    });
    console.log("oh no")
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
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

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router