const express = require("express");
const router = express.Router();

const Application = require("../models/Application1");
const uploadResume = require("../middleware/resumeUpload");

// GET all applications
router.get("/", async (req, res) => {
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

// POST Apply
router.post("/apply", uploadResume.single("resume"), async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      qualification,
    } = req.body;

    // VALIDATION ---------------------------------
    if (!firstName || !lastName) {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ error: "Valid 10-digit phone number required" });
    }

    if (!qualification) {
      return res.status(400).json({ error: "Qualification is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume upload is required" });
    }

    // CREATE APPLICATION --------------------------
    const application = new Application({
      jobId,
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      qualification,
      resumeUrl: req.file.path, // Cloudinary URL
    });

    await application.save();

    res.json({ success: true, message: "Application received!" });
  } catch (err) {
    console.log("Error creating application:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
