const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: String,
    jobTitle: String,

    firstName: String,
    lastName: String,
    qualification: String,

    resumeUrl: String, // Cloudinary URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
