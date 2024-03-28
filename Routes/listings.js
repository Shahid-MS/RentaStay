if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const asyncWrap = require("../Utils/asyncWrap");
const listingController = require("../Controllers/listings");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });

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
    upload.single("listing[image]"),
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
