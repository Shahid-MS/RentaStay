const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError");
const listings = require("./Routes/listings");
const reviews = require("./Routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");

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

const sessionOptions = {
  secret: "mySuperSecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());


app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Hii I am root");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found!"));
});

app.use((err, req, res, next) => {
  // console.log(err);
  let { status = 500, message = "Something went Wrong!" } = err;

  res.status(status).render("Listings/error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(port, () => {
  console.log("App is listening on port", port);
});
