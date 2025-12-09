const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    organization: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
