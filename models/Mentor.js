const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema(
    {
        name: String,
        role: String,
        image: String,
        shortStory: String,
        fullStory: String,
        yearsAtCompany: String,
        achievements: [String],
        quote: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Mentor", MentorSchema);
