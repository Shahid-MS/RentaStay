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

router.get("/", asyncWrap(listingController.showListings));

router.get(
  "/new",
  savedRedirectUrl,
  isLoggedIn,
  listingController.renderCreateListingForm
);

router.get("/:id", asyncWrap(listingController.showParticularListing));

router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(listingController.createNewListing)
);

router.get(
  "/:id/edit",
  savedRedirectUrl,
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrap(listingController.updateListing)
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  asyncWrap(listingController.destroyListing)
);

module.exports = router;
