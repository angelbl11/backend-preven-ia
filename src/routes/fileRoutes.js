const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const db = require("../config/firebase");


const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/extract-content",
  upload.single("file"),
  fileController.processFile
);


/**
 * Ruta para obtener un análisis clínico por ID.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection("clinical_analyses").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Análisis clínico no encontrado." });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error al obtener análisis clínico:", error);
    res.status(500).json({ error: "Error al obtener análisis clínico." });
  }
});

module.exports = router;
