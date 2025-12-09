const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String }, // URL
    description: { type: String },
    date: { type: String, required: true },
    organizers: { type: [String], default: [] },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
