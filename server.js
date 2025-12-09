require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const conversationsRouter = require("./routes/conversations");
const contactRoutes = require("./routes/contactRoute");
const eventRoutes = require("./routes/eventsRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/jobs", jobRoutes);
app.use("/resumes", resumeRoutes);
app.use("/conversations", conversationsRouter);
app.use("/contact", contactRoutes);
app.use("/events", eventRoutes);

const applicationRoutes = require("./routes/applicationsRoute");
app.use("/applications", applicationRoutes);

const path = require("path");
// const express = require("express");

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
