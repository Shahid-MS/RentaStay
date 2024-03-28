const express = require("express");
const User = require("../models/user");
const asyncWrap = require("../Utils/asyncWrap");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const router = express.Router();
const userController = require("../Controllers/user");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", asyncWrap(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  asyncWrap(userController.login)
);

router.get("/logout", userController.logout);

module.exports = router;
