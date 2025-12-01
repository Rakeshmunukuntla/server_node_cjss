const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: String,
    jobTitle: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    qualification: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application_New", ApplicationSchema);
