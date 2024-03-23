const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listings");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./Utils/asyncWrap");
const ExpressError = require("./Utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/reviews");

const app = express();
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/rentastay";

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hii I am root");
});

// app.get("/testing", async (req, res) => {
//   let sampleTesting = new Listing({
//     title: "My new villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });
//   await sampleTesting.save();
//   console.log("Sample data saved");
//   res.send("Successfully");
// });

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

app.get(
  "/listings",
  asyncWrap(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("Listings/index.ejs", { allListing });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("Listings/addNew.ejs");
});

app.get(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    // console.log(listing);
    res.render("Listings/parListing.ejs", { listing });
  })
);

app.post(
  "/listings",
  validateListing,
  asyncWrap(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

app.get(
  "/listings/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("Listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
  validateListing,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(newListing);
    res.redirect("/listings/" + id);
  })
);

app.delete(
  "/listings/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(newListing);
    res.redirect("/listings");
  })
);

//Review Routes
app.post(
  "/listings/:id/reviews",
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

app.delete(
  "/listings/:id/reviews/:reviewId",
  asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went Wrong!" } = err;
  res.status(status).render("Listings/error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(port, () => {
  console.log("App is listening on port", port);
});
