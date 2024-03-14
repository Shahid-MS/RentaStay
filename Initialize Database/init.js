const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listings");
const initData = require("./initData");

const app = express();
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/rentastay";

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

const init = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Sample data is saved");
};

init();
