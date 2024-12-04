const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/extract-content",
  upload.single("file"),
  fileController.processFile
);

module.exports = router;
