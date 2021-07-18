const mongoose = require("mongoose");

const postingSchema = new mongoose.Schema({
  title: String,
  name: String,
  content: String,
});
postingSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
postingSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Posting", postingSchema);