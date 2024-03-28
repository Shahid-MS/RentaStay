const Listing = require("./models/listings");
const ExpressError = require("./Utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path  ," ",req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    // console.log("is logged in ", req.session.redirectUrl);
    req.flash("error", "You must login first");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    // console.log("saveUrl ",res.locals.redirectUrl);
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // console.log(review);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log("Error in validate ", error);
  if (error) {
    const validationError = new ExpressError(400, error.message);
    return next(validationError);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  // console.log(req.body);
  let { error } = reviewSchema.validate(req.body);
  // console.log("Error in validate ", error);
  if (error) {
    const validationError = new ExpressError(400, error.message);
    return next(validationError);
  } else {
    next();
  }
};
