const { extractTextFromFile, saveContentDb } = require("../services/fileService");
const { processTextWithGemini } = require("../services/googleService"); // Update the import to use Gemini

/**
 * Procesa un archivo PDF y guarda el análisis clínico.
 */
exports.processFile = async (req, res) => {
  try {
    const patientID = req.body.patientID;

    if (!patientID) {
      throw new Error("El patientID es obligatorio para procesar el archivo.");
    }

    const filePath = req.file.path; // Ruta del archivo subido
    const extractedText = await extractTextFromFile(filePath);
    const analysisResult = await processTextWithGemini(extractedText, patientID); // Use Gemini for processing

    exports.patientID = patientID;

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
