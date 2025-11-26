const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    category: String,
    title: String,
    summary: String,
    author: String,
    designation: String,
    publishedDate: String,
    banner: String,
    content: String,
    readTime: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
