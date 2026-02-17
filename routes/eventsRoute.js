// const express = require("express");
// const upload = require("../middleware/upload");
// const Event = require("../models/Event");
// const Registration = require("../models/EventRegistration");

// const router = express.Router();

// // CREATE EVENT
// router.post("/", upload.single("banner"), async (req, res) => {
//   try {
//     const eventData = {
//       title: req.body.title,
//       subtitle: req.body.subtitle,
//       description: req.body.description,
//       date: req.body.date,
//       organizers: req.body.organizers ? req.body.organizers.split(",") : [],
//       location: req.body.location,
//       image: req.file?.path || "", // Cloudinary URL
//     };

//     const event = await Event.create(eventData);

//     return res.status(201).json({
//       success: true,
//       message: "Event created successfully",
//       event,
//     });
//   } catch (err) {
//     console.error("Create event error:", err);
//     res.status(500).json({ error: "Error creating event" });
//   }
// });

// // GET ALL EVENTS
// router.get("/", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 });

//     return res.json({
//       success: true,
//       events,
//     });
//   } catch (err) {
//     console.error("Error fetching events:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // DELETE EVENT
// router.delete("/:id", async (req, res) => {
//   try {
//     await Event.findByIdAndDelete(req.params.id);

//     return res.json({
//       success: true,
//       message: "Event deleted",
//     });
//   } catch (err) {
//     console.error("Error deleting event:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
// router.put("/:id", upload.single("banner"), async (req, res) => {
//   try {
//     const updateData = {
//       title: req.body.title,
//       subtitle: req.body.subtitle,
//       description: req.body.description,
//       date: req.body.date,
//       organizers: req.body.organizers ? req.body.organizers.split(",") : [],
//       location: req.body.location,
//     };

//     // If a new file is uploaded → replace existing image
//     if (req.file) {
//       updateData.image = req.file.path;
//     }

//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Event updated successfully",
//       updatedEvent,
//     });
//   } catch (err) {
//     console.error("Update event error:", err);
//     res.status(500).json({ success: false, message: "Error updating event" });
//   }
// });

// // GET EVENT BY ID
// router.get("/:id", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     res.json({
//       success: true,
//       event,
//     });
//   } catch (err) {
//     console.error("Error fetching event by ID:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// /* -------------------------
//    REGISTER USER FOR EVENT
// ----------------------------*/
// router.post("/register", async (req, res) => {
//   try {
//     const { eventId, fullName, email, phone, organization, jobTitle } =
//       req.body;

//     if (!eventId || !fullName || !email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     await Registration.create({
//       eventId,
//       fullName,
//       email,
//       phone,
//       organization,
//       jobTitle,
//     });

//     return res.json({
//       success: true,
//       message: "Registration successful!",
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//     });
//   }
// });

// /* -------------------------
//    ADMIN: GET ALL REGISTRATIONS
// ----------------------------*/
// router.get("/registrations/all", async (req, res) => {
//   try {
//     const registrations = await Registration.find().populate("eventId");
//     return res.json({ success: true, registrations });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to fetch registrations" });
//   }
// });

// router.delete("/registrations/:id", async (req, res) => {
//   try {
//     const registrationId = req.params.id;

//     const deleted = await Registration.findByIdAndDelete(registrationId);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Registration not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Registration deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete registration",
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const { upload, uploadImageToSupabase } = require("../middleware/imageUpload");

const Event = require("../models/Event");
const Registration = require("../models/EventRegistration");

const router = express.Router();

/* =============================
   CREATE EVENT
============================= */
router.post("/", upload.single("banner"), async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, "events");
    }

    const eventData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      date: req.body.date,
      organizers: req.body.organizers ? req.body.organizers.split(",") : [],
      location: req.body.location,
      image: imageUrl,
    };

    const event = await Event.create(eventData);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: "Error creating event" });
  }
});

/* =============================
   GET ALL EVENTS
============================= */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      events,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =============================
   DELETE EVENT
============================= */
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Event deleted",
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =============================
   UPDATE EVENT
============================= */
router.put("/:id", upload.single("banner"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      date: req.body.date,
      organizers: req.body.organizers ? req.body.organizers.split(",") : [],
      location: req.body.location,
    };

    if (req.file) {
      const imageUrl = await uploadImageToSupabase(req.file, "events");
      updateData.image = imageUrl;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ success: false, message: "Error updating event" });
  }
});

/* =============================
   GET EVENT BY ID
============================= */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =============================
   REGISTER USER
============================= */
router.post("/register", async (req, res) => {
  try {
    const { eventId, fullName, email, phone, organization, jobTitle } =
      req.body;

    if (!eventId || !fullName || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    await Registration.create({
      eventId,
      fullName,
      email,
      phone,
      organization,
      jobTitle,
    });

    return res.json({
      success: true,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

/* =============================
   ADMIN: GET ALL REGISTRATIONS
============================= */
router.get("/registrations/all", async (req, res) => {
  try {
    const registrations = await Registration.find().populate("eventId");
    return res.json({ success: true, registrations });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch registrations" });
  }
});

router.delete("/registrations/:id", async (req, res) => {
  try {
    const registrationId = req.params.id;

    const deleted = await Registration.findByIdAndDelete(registrationId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    return res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete registration",
    });
  }
});

module.exports = router;
