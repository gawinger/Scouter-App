const Spot = require("../models/spot.js");
const express = require("express");
const router = express.Router();

// Go to homepage
router.get("/", async (req, res) => {
  // Check if user is searching
  if (req.query.q && req.query.q != "") {
    // if so, find all spots containg searched query
    const regex = new RegExp(escapeRegex(req.query.q), "gi");
    Spot.find({ $or: [{ title: regex }, { location: regex }] }, function (err, foundspots) {
      if (err) {
        console.log(err);
      } else {
        res.render("spots", { spots: foundspots });
      }
    });
  } else {
    const spots = await Spot.find({});
    res.render("homepage", { spots });
  }
});

module.exports = router;

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
