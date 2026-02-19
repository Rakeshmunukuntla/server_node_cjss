const mongoose = require("mongoose");

const ParentalLeaderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: String,

        fullStory: String,
        yearsAtCompany: String,

        quote: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("ParentalLeader", ParentalLeaderSchema);