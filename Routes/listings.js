const express = require("express");
const Listing = require("../models/listings");
const asyncWrap = require("../Utils/asyncWrap");
const ExpressError = require("../Utils/ExpressError");
const { listingSchema } = require("../schema");

const router = express.Router();

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log("Error in validate ", error);
  if (error) {
    const validationError = new ExpressError(400, error.message);
    return next(validationError);
  } else {
    next();
  }
};

router.get(
  "/",
  asyncWrap(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("Listings/index.ejs", { allListing });
  })
);

router.get("/new", (req, res) => {
  res.render("Listings/addNew.ejs");
});

router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    // console.log(listing);
    res.render("Listings/parListing.ejs", { listing });
  })
);

router.post(
  "/",
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(newListing);
    res.redirect("/listings/" + id);
  })
);

router.delete(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(newListing);
    res.redirect("/listings");
  })
);

module.exports = router;
