const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true },

    // City / Place (free text)
    location: { type: String, required: true }, // ✔️ NO ENUM

    // Hybrid / Remote / On-site
    locationType: {
      type: String,
      enum: ["Hybrid", "Remote", "On-site"], // ✔️ ENUM HERE ONLY
      required: true,
    },

    description: { type: String, required: true },
    skills: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
