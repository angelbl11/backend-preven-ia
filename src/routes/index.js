const express = require("express");
const pdfRoutes = require("./fileRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/file", pdfRoutes);

router.use("/authentication", authRoutes);

module.exports = router;
