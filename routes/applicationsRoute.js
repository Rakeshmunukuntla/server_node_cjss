const express = require("express");
const router = express.Router();
const uploadResume = require("../middleware/resumeUpload");
const Application = require("../models/Application1");
const supabase = require("../supabase");

// GET applications
router.get("/", async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// APPLY JOB
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

    if (!req.file) return res.status(400).json({ error: "Resume is required" });

    const fileName = `${Date.now()}_${req.file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.log("Supabase Upload Error:", error);
      return res.status(500).json({ error: "Resume upload failed" });
    }

    const resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;

    await Application.create({
      jobId,
      jobTitle,
      firstName,
      lastName,
      email,
      phone,
      qualification,
      resumeUrl,
    });

    res.json({ success: true, message: "Application Submitted Successfully" });
  } catch (err) {
    console.log("Apply error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// DELETE application
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    await Application.findByIdAndDelete(id);

    res.json({ success: true, message: "Application deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
