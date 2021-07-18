const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  nickname: String,
  comment: String,
  postId: String,
});


module.exports = mongoose.model("Comments", commentSchema);