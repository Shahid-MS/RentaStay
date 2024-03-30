const Listing = require("../models/listings");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.showListings = async (req, res) => {
  const allListing = await Listing.find({});
  // console.log(allListing);
  res.render("Listings/index.ejs", { allListing });
};

module.exports.renderCreateListingForm = (req, res) => {
  res.render("Listings/addNew.ejs");
};

module.exports.showParticularListing = async (req, res) => {
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
};

module.exports.createNewListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, filename);
  newListing.image = { url, filename };

  let responseGeocoding = await geocodingClient
    .forwardGeocode({
      query: newListing.location + ", " + newListing.country,
      limit: 1,
    })
    .send();

  // console.log(responseGeocoding);
  // console.log(responseGeocoding.body);
  // console.log(responseGeocoding.body);
  // console.log(responseGeocoding.body.features); Array of object as per limit
  // console.log(responseGeocoding.body.features[0]);
  // console.log(responseGeocoding.body.features[0].geometry);

  newListing.geometry = responseGeocoding.body.features[0].geometry;

  let savedListing = await newListing.save();
  // console.log(savedListing);
  req.flash("success", "Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", `Listing with id : ${id} is not present`);
    res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload", "/upload/w-250");
  res.render("Listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated Successfully");
  res.redirect("/listings/" + id);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  // console.log(newListing);
  req.flash("success", "Listing deleted Successfully");
  res.redirect("/listings");
};
