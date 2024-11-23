const express = require("express");
const pdfRoutes = require("./fileRoutes");

const router = express.Router();

router.use("/file", pdfRoutes);

module.exports = router;
