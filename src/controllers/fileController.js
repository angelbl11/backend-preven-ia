const { extractTextFromFile } = require("../services/fileService");
const { processTextWithOpenAI } = require("../services/openaiService");

/**
 * Procesa un archivo PDF y guarda el análisis clínico.
 */
exports.processFile = async (req, res) => {
  try {
    const filePath = req.file.path; // Ruta del archivo subido
    const extractedText = await extractTextFromFile(filePath);

    const analysisResult = await processTextWithOpenAI(extractedText);

    res.status(200).json({
      success: true,
      message: "Archivo procesado y análisis clínico guardado exitosamente.",
      data: analysisResult,
    });
  } catch (error) {
    console.error("Error procesando el archivo:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
