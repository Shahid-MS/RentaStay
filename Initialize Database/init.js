const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listings");
const initData = require("./initData");
const newInitData = require("./newInitData");

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

  // initData.data = initData.data.map((obj) => ({
  //   ...obj,
  //   owner: "6603f8e490f62f20d07d4cb1",
  // }));
  // await Listing.insertMany(initData.data);

  newInitData.data = newInitData.data.map((obj) => ({
    ...obj,
    owner: "6603f8e490f62f20d07d4cb1",
  }));
  await Listing.insertMany(newInitData.data);

  console.log("Sample data is saved");
};

init();
