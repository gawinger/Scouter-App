const Review = require("../models/review");
const Spot = require("../models/spot");
const { ratingCounter, ratingCounterDelete } = require("../public/scripts/ratingCounter");

// Create new review
module.exports.new = async (req, res) => {
  // Find spot by ID and populate its reviews
  const spot = await Spot.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "createdBy",
    },
  });

  const review = new Review(req.body.review);
  // Check if there is review about this spot already created by logged user
  const getReview = spot.reviews.find((rev) => rev.createdBy._id.toString() == req.user._id.toString());
  // if there is review send flash message 
  if (getReview) {
    req.flash("error", "You can't add more than one review");
    return res.redirect(`/spots/${spot.id}`);
  }
  // if user didnt review yet create new review
  review.createdBy = req.user._id;
  spot.reviews.push(review);
  ratingCounter(spot);
  await spot.save();
  await review.save();
  req.flash("success", "You Created New Review");
  res.redirect(`/spots/${spot.id}`);
};

// Edit Review
module.exports.edit = async (req, res) => {
  const { id, reviewId } = req.params;
  // Find review in database and replace its values
  const review = await Review.findById(reviewId);
  review.rating = Number(req.body.review.rating);
  review.text = req.body.review.text;
  await review.save();

  const spot = await Spot.findById(id).populate({
    path: "reviews",
    populate: {
      path: "createdBy",
    },
  });

  ratingCounter(spot);
  await spot.save();
  req.flash("success", "Succesfully edited Your review");
  res.redirect(`/spots/${spot.id}`);
};

// Delete review
module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  const spot = await Spot.findById(id).populate({
    path: "reviews",
    populate: {
      path: "createdBy",
    },
  });

  // Pull review from spot and delete review from database
  await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  const review = await Review.findByIdAndDelete(reviewId);

  // Update rating value
  ratingCounterDelete(spot, review);
  await spot.save();
  req.flash("success", "You Deleted Your Review");
  res.redirect(`/spots/${id}`);
};
