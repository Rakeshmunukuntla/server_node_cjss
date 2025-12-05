// routes/contact.js
const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// POST /contact → save contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const saved = await Contact.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Error saving contact:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /contact → list all contact form entries
router.get("/", async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: list.length,
      contacts: list,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /contact/:id → delete one contact entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.json({
      success: true,
      message: "Contact deleted successfully",
      deleted: contact,
    });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
