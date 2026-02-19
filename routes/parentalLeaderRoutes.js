const express = require("express");
const ParentalLeader = require("../models/ParentalLeader");
const { upload, uploadImageToSupabase } = require("../middleware/imageUpload");

const router = express.Router();

/* =============================
   GET ALL PARENTAL LEADERS
============================= */
router.get("/", async (req, res) => {
    try {
        const leaders = await ParentalLeader.find().sort({ createdAt: -1 });
        res.json(leaders);
    } catch (err) {
        console.log("Fetch parental leaders error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   GET SINGLE PARENTAL LEADER
============================= */
router.get("/:id", async (req, res) => {
    try {
        const leader = await ParentalLeader.findById(req.params.id);
        if (!leader)
            return res.status(404).json({ error: "Parental Leader not found" });

        res.json(leader);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

/* =============================
   CREATE PARENTAL LEADER
============================= */
router.post("/", upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadImageToSupabase(req.file, "parental-leaders");
        }

        const leaderData = {
            name: req.body.name,
            role: req.body.role,
            image: imageUrl,
            fullStory: req.body.fullStory,
            yearsAtCompany: req.body.yearsAtCompany,
            quote: req.body.quote,
        };

        const leader = await ParentalLeader.create(leaderData);
        res.json(leader);
    } catch (err) {
        console.log("Create parental leader error:", err);
        res.status(500).json({ error: "Error creating parental leader" });
    }
});

/* =============================
   UPDATE PARENTAL LEADER
============================= */
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            const imageUrl = await uploadImageToSupabase(req.file, "parental-leaders");
            updateData.image = imageUrl;
        }

        const leader = await ParentalLeader.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(leader);
    } catch (err) {
        console.log("Update parental leader error:", err);
        res.status(500).json({ error: "Error updating parental leader" });
    }
});

/* =============================
   DELETE PARENTAL LEADER
============================= */
router.delete("/:id", async (req, res) => {
    try {
        await ParentalLeader.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Parental Leader deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting parental leader" });
    }
});

module.exports = router;