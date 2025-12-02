// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // RAW file storage (PDF, DOC, DOCX)
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "cjss_resumes", // NEW folder only for resumes
//     resource_type: "raw", // <— IMPORTANT
//     allowed_formats: ["pdf", "doc", "docx"],
//   },
// });

// const uploadResume = multer({ storage });

// module.exports = uploadResume;

// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: (req, file) => {
//     // extract file extension from original name
//     const ext = file.originalname.split(".").pop();

//     return {
//       folder: "cjss_resumes",
//       resource_type: "raw",
//       public_id: file.originalname.replace(/\.[^/.]+$/, ""), // name without extension
//       format: ext, // <--- PRESERVE EXTENSION
//     };
//   },
// });

// const uploadResume = multer({ storage });

// module.exports = uploadResume;

const multer = require("multer");

// Multer memory storage (stores file in RAM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
