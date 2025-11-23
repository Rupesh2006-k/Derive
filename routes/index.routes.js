/** @format */
let mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth");
const fileModel = require("../models/files.model");
const cloudinary = require("../config/cloudinary.config");

const upload = multer({ dest: "temp/" });

/* ----------------------------------------
   HOME PAGE - SHOW ALL FILES
------------------------------------------- */
router.get("/home", authMiddleware, async (req, res) => {
  try {
    const userFiles = await fileModel.find({ user: req.user.id });
    res.render("home", { files: userFiles });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* ----------------------------------------
    UPLOAD FILE → CLOUDINARY
------------------------------------------- */
router.post(
  "/upload-file",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user-files",
      });

      // SAVE TO MONGODB
      const newFile = await fileModel.create({
        url: result.secure_url,         // ✔ Cloudinary URL
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        cloudinaryId: result.public_id, // ✔ Useful for delete
        user: req.user.id,
      });

      console.log("Uploaded File:", newFile);

      res.redirect("/home");
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ----------------------------------------
    DOWNLOAD / OPEN FILE
------------------------------------------- */
router.get("/download/:id", authMiddleware, async (req, res) => {
  const fileId = req.params.id;

  // VALID OBJECT ID CHECK
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res.status(400).json({ message: "Invalid file ID" });
  }

  try {
    const file = await fileModel.findOne({
      user: req.user.id,
      _id: fileId,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // ✔ Redirect to Cloudinary URL
    return res.redirect(file.url);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
