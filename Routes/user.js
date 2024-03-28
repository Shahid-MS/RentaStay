const express = require("express");
const User = require("../models/user");
const asyncWrap = require("../Utils/asyncWrap");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
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

      req.login(regUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash(
          "success",
          "Welcome to Renta Stay. Account created successfully"
        );
        res.redirect("/listings");
      });
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
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  asyncWrap(async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // console.log(redirectUrl);
    req.flash("success", "Welcome back to Renta Stay!");
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
