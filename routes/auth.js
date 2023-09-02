const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";


router.get("/login/success", (req, res) => {
  if (req.user) {
    console.log("yo from success")
    
    // success path needs to get data from database and attach it to req.user
    req.user.userName = "genericEric",
    req.user.totalPoints = 1000,
    req.user.ranking = {userRank: 7, totalPlayers: 11},
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