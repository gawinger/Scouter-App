const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// configure image schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// add virtual to image schema
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const opts = { toJSON: { virtuals: true } };

// configure spot schema
const SpotSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    rating: Number,
    rateNumber: Number,
    description: String,
    location: String,
    address: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// add virtual to spot schema creating div with spot information
SpotSchema.virtual("properties.mapPointText").get(function () {
  if (this.images[0] && this.images[0].url) {
    imgUrl = this.images[0].url;
  } else {
    imgUrl = "/photos/photo-placeholder.png";
  }
  return `
  <div class="row">
    <div class="col-12 mb-0 pb-0 mapText-container">
      <a href="/spots/${this._id}"><img class="mb-2 mapText-img" src='${imgUrl}'/></a>
        <div class="text-center lh-1">
          <a class="fs-5 lh-1 mapText-a" href="/spots/${this._id}">${this.title}</a>      
        </div>
      </div>
  </div>
  `;
});

// when deleting spot schema delete reviews connected with this spot
SpotSchema.post("findOneAndDelete", async function (deleted) {
  if (deleted) {
    await Review.deleteMany({
      id: {
        $in: deleted.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Spot", SpotSchema);
