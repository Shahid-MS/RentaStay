const express = require("express");
const User = require("../models/user");
const asyncWrap = require("../Utils/asyncWrap");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const router = express.Router();
const userController = require("../Controllers/user");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(asyncWrap(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .get(userController.renderSignupForm)
  .post(
    savedRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncWrap(userController.login)
  );

router.get("/logout", userController.logout);

module.exports = router;
