module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path  ," ",req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    console.log("is logged in ", req.session.redirectUrl);
    req.flash("error", "You must login first");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("saveUrl ",res.locals.redirectUrl);
  }
  next();
};
