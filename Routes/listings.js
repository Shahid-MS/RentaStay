const express = require("express");
const Listing = require("../models/listings");
const asyncWrap = require("../Utils/asyncWrap");

const {
  isLoggedIn,
  savedRedirectUrl,
  isOwner,
  validateListing,
} = require("../middleware");

const router = express.Router();

router.get(
  "/",
  asyncWrap(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("Listings/index.ejs", { allListing });
  })
);

router.get("/new", savedRedirectUrl, isLoggedIn, (req, res) => {
  res.render("Listings/addNew.ejs");
});

router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    // console.log(listing);
    if (!listing) {
      req.flash("error", `Listing with id : ${id} is not present`);
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("Listings/parListing.ejs", { listing });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing Added Successfully");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  savedRedirectUrl,
  isLoggedIn,
  isOwner,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", `Listing with id : ${id} is not present`);
      res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(newListing);
    req.flash("success", "Listing updated Successfully");
    res.redirect("/listings/" + id);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(newListing);
    req.flash("success", "Listing deleted Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
