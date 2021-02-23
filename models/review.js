const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// configure review schema
const reviewSchema = new Schema({
  text: String,
  rating: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
