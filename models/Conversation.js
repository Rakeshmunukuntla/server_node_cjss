// models/Conversation.js
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    initiative: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
