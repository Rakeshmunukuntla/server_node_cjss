const express = require("express");
const Leader = require("../models/Leader");
const { upload, uploadImageToSupabase } = require("../middleware/imageUpload");

const router = express.Router();

/* =============================
   GET ALL LEADERS
============================= */
router.get("/", async (req, res) => {
    try {
        const leaders = await Leader.find().sort({ createdAt: -1 });
        res.json(leaders);
    } catch (err) {
        console.log("Fetch leaders error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   GET SINGLE LEADER
============================= */
router.get("/:id", async (req, res) => {
    try {
        const leader = await Leader.findById(req.params.id);
        if (!leader) return res.status(404).json({ error: "Leader not found" });
        res.json(leader);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   CREATE LEADER
============================= */
router.post("/", upload.single("profileImage"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadImageToSupabase(req.file, "leaders");
        }

        // ✅ Fix bio array
        let bio = req.body.bio || [];
        if (typeof bio === "string") {
            bio = [bio];
        }

        const leaderData = {
            name: req.body.name,
            designation: req.body.designation,
            profileImage: imageUrl,
            bio: bio,
            quote: req.body.quote,
        };

        const leader = await Leader.create(leaderData);
        res.json(leader);
    } catch (err) {
        console.log("Create leader error:", err);
        res.status(500).json({ error: "Error creating leader" });
    }
});

/* =============================
   UPDATE LEADER
============================= */
router.put("/:id", upload.single("profileImage"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            const imageUrl = await uploadImageToSupabase(req.file, "leaders");
            updateData.profileImage = imageUrl;
        }

        if (req.body.bio) {
            let bio = req.body.bio;
            if (typeof bio === "string") {
                bio = [bio];
            }
            updateData.bio = bio;
        }

        const leader = await Leader.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(leader);
    } catch (err) {
        console.log("Update leader error:", err);
        res.status(500).json({ error: "Error updating leader" });
    }
});

/* =============================
   DELETE LEADER
============================= */
router.delete("/:id", async (req, res) => {
    try {
        await Leader.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Leader deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting leader" });
    }
});

module.exports = router;