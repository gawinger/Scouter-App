const express = require("express");
const router = express.Router();
const asyncError = require("../utils/async-error");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isLoggedUser, isOwner, validateSpot } = require("../middleware");

const spots = require("../controllers/spots");

router
  .route("/")
  // Show all spots
  .get(asyncError(spots.spots))
  // Create new spot
  .post(isLoggedUser, upload.array("spot[image]"), validateSpot, asyncError(spots.create));

// Show form to create new spot
router.get("/new", isLoggedUser, spots.createForm);

router
  .route("/:id")
  // Show spot with defined ID
  .get(asyncError(spots.show))
  // Update spot
  .put(isLoggedUser, isOwner, upload.array("spot[image]"), asyncError(spots.edit))
  // Delete spot
  .delete(isLoggedUser, isOwner, asyncError(spots.delete));

// Show form to edit spot
router.get("/:id/edit", isLoggedUser, isOwner, asyncError(spots.editForm));

// Show form to edit photos
router.get("/:id/edit/photos", isLoggedUser, isOwner, asyncError(spots.editPhotosForm));

// Edit photos
router.put("/:id/edit/photos", isLoggedUser, upload.array("spot[image]"), asyncError(spots.editPhoto));

// Delete photo
router.delete("/:id/edit/photos", isLoggedUser, isOwner, asyncError(spots.deletePhoto));

module.exports = router;
