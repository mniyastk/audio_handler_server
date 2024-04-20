const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log( "cloud_name :" ,process.env.CLOUD_NAME,
   )
// Mongoose connection (replace with your actual connection string)
mongoose.connect("mongodb://127.0.0.1:27017/your_database_name")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration
const upload = multer({
  dest: "uploads/", // Temporary directory for uploaded files (optional, can be removed)
  fileFilter: (req, file, cb) => {
    // Optional: Validate file type (uncomment to enable)
    // if (!file.mimetype.match(/audio\/(mpeg|mp3|ogg|flac)/i)) {
    //   cb(new Error("File does not support audio formats"), false);
    //   return;
    // }
    cb(null, true);
  },
});

// Upload route
app.post("/upload-audio", upload.single("audioFile"), async (req, res) => {
    console.log(req.file)
  try {
    if (req.file) {
      const uploadedFile = req.file;

      // Upload to Cloudinary using either approach:

      // Option 1: Using temporary file path (if `dest` is set in Multer)
    //   const uploadResult = await cloudinary.uploader.upload(uploadedFile.path, {
    //     resource_type: "video", // Use 'video' for audio uploads
    //   });

      // Option 2: Accessing file data directly (without temporary storage)
      const uploadResult = await cloudinary.uploader.upload(uploadedFile.path, {
        resource_type: 'video', // Use 'video' for audio uploads
      });
      console.log(uploadResult)
      res.status(200).json({ message: "Audio uploaded successfully!", uploadResult });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
