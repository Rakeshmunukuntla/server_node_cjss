const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        designation: { type: String, required: true },
        profileImage: String,

        // Array of paragraphs
        bio: [String],

        quote: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Leader", LeaderSchema);