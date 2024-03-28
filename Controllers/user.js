const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("Users/signup.ejs");
};

module.exports.signup = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render("Users/login.ejs");
};

module.exports.login = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";
  // console.log(redirectUrl);
  req.flash("success", "Welcome back to Renta Stay!");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  });
};
