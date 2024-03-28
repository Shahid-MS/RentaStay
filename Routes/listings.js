const express = require("express");
const asyncWrap = require("../Utils/asyncWrap");
const listingController = require("../Controllers/listings");

const {
  isLoggedIn,
  savedRedirectUrl,
  isOwner,
  validateListing,
} = require("../middleware");


const router = express.Router();

router
  .route("/")
  .get(asyncWrap(listingController.showListings))
  .post(
    isLoggedIn,
    validateListing,
    asyncWrap(listingController.createNewListing)
  );

router.get(
  "/new",
  savedRedirectUrl,
  isLoggedIn,
  listingController.renderCreateListingForm
);

router
  .route("/:id")
  .get(asyncWrap(listingController.showParticularListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    asyncWrap(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(listingController.destroyListing));

router.get(
  "/:id/edit",
  savedRedirectUrl,
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.renderEditForm)
);

module.exports = router;
