const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncError = require("../utils/async-error");
const { isLoggedUser, validateReview, isReviewAuthor } = require("../middleware");

const reviews = require("../controllers/reviews");

// Create new review
router.post("/", validateReview, isLoggedUser, asyncError(reviews.new));

// Edit review
router.put("/:reviewId", validateReview, isLoggedUser, asyncError(reviews.edit));

// Delete review
router.delete("/:reviewId", isLoggedUser, isReviewAuthor, reviews.delete);

module.exports = router;
