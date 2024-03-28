const Review = require("../models/reviews");
const Listing = require("../models/listings");

module.exports.createNewReview = async (req, res, next) => {
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
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted Successfully");
  res.redirect(`/listings/${id}`);
};
