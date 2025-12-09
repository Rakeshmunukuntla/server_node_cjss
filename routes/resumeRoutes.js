const express = require("express");
const router = express.Router();

const uploadResume = require("../middleware/resumeUpload"); // you already use this for applications
const Resume = require("../models/Resume");
const supabase = require("../supabase");

// POST /resumes/upload  → only stores resume, no job data
router.post("/upload", uploadResume.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Resume file is required" });
    }

    // unique filename for Supabase
    const fileName = `${Date.now()}_${req.file.originalname}`;

    const { error } = await supabase.storage
      .from("resumes") // same bucket you already use
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Resume upload failed" });
    }

    const resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;

    // save to Resume collection (NOT Application)
    const doc = await Resume.create({
      originalName: req.file.originalname,
      resumeUrl,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    return res.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: doc,
    });
  } catch (err) {
    console.error("Resume upload API error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// (optional) GET /resumes → list all resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, resumes });
  } catch (err) {
    console.error("Fetch resumes error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// DELETE /resumes/:id  → delete resume from DB + Supabase bucket
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // 1️⃣ Find resume in MongoDB
    const resume = await Resume.findById(id);
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, error: "Resume not found" });
    }

    // Extract the file name from the URL
    const fileUrl = resume.resumeUrl;
    const fileName = fileUrl.split("/").pop(); // last part of URL

    // 2️⃣ Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from("resumes")
      .remove([fileName]);

    if (deleteError) {
      console.error("Supabase Delete Error:", deleteError);
      return res.status(500).json({
        success: false,
        error: "Failed to delete file from storage",
      });
    }

    // 3️⃣ Delete from MongoDB
    await Resume.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    console.error("Delete resume error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
