const fs = require('fs');
const usersController = require("../controllers/users_controller");
const { promisify } = require('util');

const usersRouter = require('express').Router();

const passport = require("passport");

const CLIENT_URL = "http://localhost:3000";

// const router = require('express').Router();



// usersRouter.
//   get("/", (req, res) => {
//     res.status(200).json({
//       message: "yo from users",
//   })
// });


usersRouter.
  get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        // cookies: req.cookies
      });
    }
  });

  usersRouter.
    get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failed to authenticate",
    });
});

usersRouter.
  get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
  });

usersRouter.
  get("/google", passport.authenticate("google", { scope: ["profile"] }));

usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = usersRouter;
// module.exports = router;