const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://news.airbnb.com/wp-content/uploads/sites/4/2023/06/DJI_20230524063911_0068_D_Gassho_Village-Aerial_Credit-Satoshi-Nagare_4200x2800px.jpg?w=2048",
    set: (v) =>
      v === ""
        ? "https://news.airbnb.com/wp-content/uploads/sites/4/2023/06/DJI_20230524063911_0068_D_Gassho_Village-Aerial_Credit-Satoshi-Nagare_4200x2800px.jpg?w=2048"
        : v,
  },
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
