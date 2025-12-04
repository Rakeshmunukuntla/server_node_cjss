const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // You can add more fields later (name, email, etc.)
    originalName: { type: String, required: true },
    resumeUrl: { type: String, required: true }, // Supabase public URL
    size: { type: Number },
    mimeType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
