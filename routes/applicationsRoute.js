const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const uploadResume = require("../middleware/resumeUpload");

// GET all applications
router.get("/apply", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/apply", uploadResume.single("resume"), async (req, res) => {
  try {
    const { jobId, jobTitle, firstName, lastName, qualification } = req.body;

    const application = new Application({
      jobId,
      jobTitle,
      firstName,
      lastName,
      qualification,
      resumeUrl: req.file ? req.file.path : null, // Cloudinary URL
    });

    await application.save();

    res.json({ success: true, message: "Application received!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
