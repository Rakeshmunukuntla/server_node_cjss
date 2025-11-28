const express = require("express");
const Blog = require("../models/Blog");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Public: get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// Public: get single blog by id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// Admin: create blog
// router.post("/", auth, async (req, res) => {
//   try {
//     const blog = await Blog.create(req.body);
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating blog" });
//   }
// });

router.post("/", upload.single("banner"), async (req, res) => {
  try {
    // const baseUrl = `${req.protocol}://${req.get("host")}`;

    const blogData = {
      ...req.body,
      // banner: req.file ? `${baseUrl}/uploads/${req.file.filename}` : "",
      banner: req.file?.path || "",
    };

    const blog = await Blog.create(blogData);
    res.json(blog);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ error: "Error creating blog" });
  }
});

// Admin: update blog
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating blog" });
//   }
// });

// router.put("/:id", upload.single("banner"), async (req, res) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get("host")}`;
//     const updateData = { ...req.body };

//     if (req.file) {
//       updateData.banner = `${baseUrl}/uploads/${req.file.filename}`;
//     }

//     const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     res.json(blog);
//   } catch (err) {
//     console.error("Update blog error:", err);
//     res.status(500).json({ message: "Error updating blog" });
//   }
// });

router.put("/:id", upload.single("banner"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.banner = req.file.path; // Cloudinary URL
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(blog);
  } catch (err) {
    console.error("Update blog error:", err);
    res.status(500).json({ message: "Error updating blog" });
  }
});

// Admin: delete blog
router.delete("/:id", auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

module.exports = router;
