const Review = require("./models/review");
const Spot = require("./models/spot");
const { spotSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/express-error");

// Check if user is logged in
module.exports.isLoggedUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  next();
};

// Check if logged user is owner of spot
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);
  if (req.user.email === "5575040@gmail.com") {
    next();
  } else {
    if (!spot.createdBy.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/spots/${id}`);
    }
    next();
  }
};

// Check if there are any errors (for spots)
module.exports.validateSpot = (req, res, next) => {
  if (req.body.spot.image === "") {
    req.body.spot.image = [];
  }
  const { error } = spotSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.messsage).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Check if there are any errors (for reviews)
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Check if logged user is creator of review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    next();
  }
  if (req.user.email === "5575040@gmail.com") {
    next();
  } else {
    if (!review.createdBy.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/spots/${id}`);
    }
    next();
  }
};
