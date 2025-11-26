// const express = require("express");
// const Job = require("../models/Job");
// const auth = require("../middleware/authMiddleware");

// const router = express.Router();

// // Public: get all jobs
// router.get("/", async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching jobs" });
//   }
// });

// // Public: get single job
// router.get("/:id", async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Not found" });
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching job" });
//   }
// });

// // Admin: create job
// router.post("/", auth, async (req, res) => {
//   try {
//     const job = await Job.create(req.body);
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating job" });
//   }
// });

// // Admin: update job
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating job" });
//   }
// });

// // Admin: delete job
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     await Job.findByIdAndDelete(req.params.id);
//     res.json({ message: "Job deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting job" });
//   }
// });

// module.exports = router;

const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Public: get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Public: get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching job" });
  }
});

// Admin: create job
router.post("/", auth, async (req, res) => {
  console.log("REQ BODY /jobs:", req.body); // debug
  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating job" });
  }
});

// Admin: update job
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating job" });
  }
});

// Admin: delete job
router.delete("/:id", auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

module.exports = router;
