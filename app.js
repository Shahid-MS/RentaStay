const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listings");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./Utils/asyncWrap");
const ExpressError = require("./Utils/ExpressError");
const { listingSchema } = require("./schema");
const { threadId } = require("worker_threads");

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
    const listing = await Listing.findById(id);
    res.render("Listings/parListing.ejs", { listing });
  })
);

app.post(
  "/listings",
  asyncWrap(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    
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
  asyncWrap(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send Valid data for listing");
    }
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
