const express = require("express");
const Mentor = require("../models/Mentor");

const { upload, uploadImageToSupabase } = require("../middleware/imageUpload");

const router = express.Router();

/* =============================
   GET ALL MENTORS (PUBLIC)
============================= */
router.get("/", async (req, res) => {
    try {
        const mentors = await Mentor.find().sort({ createdAt: -1 });
        res.json(mentors);
    } catch (err) {
        console.log("Fetch mentors error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   GET SINGLE MENTOR
============================= */
router.get("/:id", async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) return res.status(404).json({ error: "Mentor not found" });
        res.json(mentor);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   CREATE MENTOR
============================= */

router.post("/", upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadImageToSupabase(req.file, "mentors");
        }

        // 🟢 FIX HERE
        let achievements = req.body.achievements || [];

        // if single achievement, convert to array
        if (typeof achievements === "string") {
            achievements = [achievements];
        }

        const mentorData = {
            name: req.body.name,
            role: req.body.role,
            shortStory: req.body.shortStory,
            fullStory: req.body.fullStory,
            yearsAtCompany: req.body.yearsAtCompany,
            quote: req.body.quote,
            image: imageUrl,
            achievements: achievements,
        };

        const mentor = await Mentor.create(mentorData);
        res.json(mentor);
    } catch (err) {
        console.log("Create mentor error:", err);
        res.status(500).json({ error: "Error creating mentor" });
    }
});


/* =============================
   UPDATE MENTOR
============================= */
// router.put("/:id", upload.single("image"), async (req, res) => {
//     try {
//         const updateData = { ...req.body };

//         if (req.file) {
//             const imageUrl = await uploadImageToSupabase(req.file, "mentors");
//             updateData.image = imageUrl;
//         }

//         if (req.body.achievements) {
//             updateData.achievements = JSON.parse(req.body.achievements);
//         }

//         const mentor = await Mentor.findByIdAndUpdate(req.params.id, updateData, {
//             new: true,
//         });

//         res.json(mentor);
//     } catch (err) {
//         console.log("Update mentor error:", err);
//         res.status(500).json({ error: "Error updating mentor" });
//     }
// });

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // 🟢 IMAGE upload
        if (req.file) {
            const imageUrl = await uploadImageToSupabase(req.file, "mentors");
            updateData.image = imageUrl;
        }

        // 🟢 FIX achievements (no JSON.parse)
        if (req.body.achievements) {
            let achievements = req.body.achievements;

            // if single achievement → convert to array
            if (typeof achievements === "string") {
                achievements = [achievements];
            }

            updateData.achievements = achievements;
        }

        const mentor = await Mentor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(mentor);
    } catch (err) {
        console.log("Update mentor error:", err);
        res.status(500).json({ error: "Error updating mentor" });
    }
});


/* =============================
   DELETE MENTOR
============================= */
router.delete("/:id", async (req, res) => {
    try {
        await Mentor.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Mentor deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting mentor" });
    }
});

module.exports = router;
