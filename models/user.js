const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// configure user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// add passport local mongoose npm to user schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
