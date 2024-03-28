const express = require("express");
const Listing = require("../models/listings");
const asyncWrap = require("../Utils/asyncWrap");
const Review = require("../models/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

//Review Routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // console.log(review);
    listing.reviews.push(review);
    // console.log(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added Successfully");
    res.redirect(`/listings/${id}`);
  })
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted Successfully");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
