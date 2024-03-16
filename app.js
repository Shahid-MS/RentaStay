const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listings");
const ejsMate = require("ejs-mate");

const app = express();
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/rentastay";

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, () => {
  console.log("App is listening on port", port);
});

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

app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("Listings/index.ejs", { allListing });
});

app.get("/listings/new", (req, res) => {
  res.render("Listings/addNew.ejs");
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("Listings/parListing.ejs", { listing });
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("Listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  // console.log(newListing);
  res.redirect("/listings/" + id);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  // console.log(newListing);
  res.redirect("/listings");
});
