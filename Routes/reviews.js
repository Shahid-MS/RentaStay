const express = require("express");
const asyncWrap = require("../Utils/asyncWrap");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../Controllers/reviews");


const router = express.Router({ mergeParams: true });


//Review Routes
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrap(reviewController.createNewReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(reviewController.destroyReview)
);

module.exports = router;
