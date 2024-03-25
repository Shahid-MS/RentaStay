const express = require("express");
const Listing = require("../models/listings");
const asyncWrap = require("../Utils/asyncWrap");
const ExpressError = require("../Utils/ExpressError");
const { reviewSchema } = require("../schema");
const Review = require("../models/reviews");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
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

//Review Routes
router.post(
  "/",
  validateReview,
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    // console.log(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

//delete review route
router.delete(
  "/:reviewId",
  asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
