const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/extract-text-from-file",
  upload.single("file"),
  fileController.processFile
);

module.exports = router;
