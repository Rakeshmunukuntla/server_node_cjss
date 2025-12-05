// routes/conversations.js
const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();

// POST /conversations — save form submission
router.post("/", async (req, res) => {
  try {
    const { email, initiative } = req.body;

    if (!email || !initiative) {
      return res.status(400).json({
        success: false,
        message: "Email and initiative are required",
      });
    }

    const convo = await Conversation.create({ email, initiative });

    return res.status(201).json({
      success: true,
      message: "Conversation created",
      conversation: convo,
    });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /conversations — list for admin
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /conversations/:id — delete a conversation
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Conversation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.json({
      success: true,
      message: "Conversation deleted successfully",
      deleted,
    });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
