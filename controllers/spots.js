const Spot = require("../models/spot");
const addressChecker = require("../public/scripts/addressChecker");

const { cloudinary } = require("../cloudinary");

// Show all spots
module.exports.spots = async (req, res) => {
  const spots = await Spot.find({});
  res.render("spots", { spots });
};

// Show form to create new spot
module.exports.createForm = (req, res) => {
  res.render("new-spot");
};

// Create new spot
module.exports.create = async (req, res, next) => {
  const geoData = await addressChecker(req);
  // Set spot geometry to checked address
  req.body.spot.geometry = geoData.body.features[0].geometry;
  const spot = new Spot(req.body.spot);
  // Set images url and filename
  spot.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  spot.createdBy = req.user._id;
  await spot.save();
  req.flash("success", "Succesfuly Created New Spot");
  res.redirect(`/spots/${spot._id}`);
};

// Show spot with defined ID
module.exports.show = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "createdBy",
      },
    })
    .populate("createdBy");
  if (!spot) {
    req.flash("error", "We could not find that spot");
    return res.redirect("/spots");
  }
  res.render("show-spot", { spot });
};

// Show form to edit spot
module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);
  if (!spot) {
    req.flash("error", "We could not find that spot");
    return res.redirect("/spots");
  }
  res.render("edit-spot", { spot });
};

// Update spot
module.exports.edit = async (req, res) => {
  const geoData = await addressChecker(req);
  // Set spot geometry to checked address
  req.body.spot.geometry = geoData.body.features[0].geometry;
  const { id } = req.params;
  const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
  // check is user is adding images
  if (req.file) {
    // if there are more that 5 images on update flash error
    if (req.files.length > 5) {
      req.flash("error", "You can add only 5 images at once");
      return res.redirect(`/spots/${spot.id}/edit/photos`);
    }
    // map all added files
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    // check if all images amount is greater than 12
    // if so flash error
    if (imgs.length + spot.images.length >= 12) {
      req.flash("error", "One spot can't have more than 12 images");
      return res.redirect(`/spots/${spot.id}/edit/photos`);
    }
    // push files into existing images array
    spot.images.push(...imgs);
  }
  await spot.save();
  req.flash("success", "succesfully updated spot");
  res.redirect(`/spots/${spot.id}`);
};

// Show form to edit photos
module.exports.editPhotosForm = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);
  if (!spot) {
    req.flash("error", "We could not find that spot");
    return res.redirect("/spots");
  }
  res.render("edit-photos-spot", { spot });
};

// Edit photos
// working in same idea as upadting spot
module.exports.editPhoto = async (req, res) => {
  const { id } = req.params;
  let spot = "";
  if ((req.body = {})) {
    spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
  } else {
    spot = await Spot.findById(id);
  }
  if (req.files.length > 5) {
    req.flash("error", "You can add only 5 images at once");
    return res.redirect(`/spots/${spot.id}/edit/photos`);
  }
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  if (imgs.length + spot.images.length >= 12) {
    req.flash("error", "One spot can't have more than 12 images");
    return res.redirect(`/spots/${spot.id}/edit/photos`);
  }
  spot.images.push(...imgs);
  await spot.save();
  req.flash("success", "succesfully updated spot");
  res.redirect(`/spots/${spot.id}`);
};

// delete photo
module.exports.deletePhoto = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findById(id);
  for (let filename of req.body.deletedImages) {
    await cloudinary.uploader.destroy(filename);
  }
  // pull deleted image from spot and remove it
  await spot.updateOne({ $pull: { images: { filename: { $in: req.body.deletedImages } } } }, { new: true });
  await spot.save();
  req.flash("success", "Succesfully Deleted Photo");
  res.redirect(`/spots/${spot.id}/edit/photos`);
};

// Delete spot
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const spot = await Spot.findByIdAndDelete(id);
  req.flash("success", "Succesfully Deleted Spot");
  res.redirect("/spots");
};
