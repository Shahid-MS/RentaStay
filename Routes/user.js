const express = require("express");
const User = require("../models/user");
const asyncWrap = require("../Utils/asyncWrap");
const passport = require("passport");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("Users/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const regUser = await User.register(newUser, password);
      //   console.log(regUser);
      req.flash("success", "Welcome to Renta Stay");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("Users/login.ejs");
});

router.post(
  "/login",

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(async (req, res) => {
    req.flash("success", "Welcome back to Renta Stay!");
    res.redirect("/listings");
  })
);

module.exports = router;
