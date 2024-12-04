const fileService = require("../services/fileService");
const openaiService = require("../services/openaiService");
const fs = require("fs");

exports.processFile = async (req, res) => {
  try {
    const filePath = req.file.path; // Ruta del archivo subido
    const fileId = req.body.fileId; // Identificador único del archivo (si aplica)

    // Obtener el ID del paciente desde Firebase usando el fileId
    const patientId = await analysisService.getPatientIdFromFile(fileId);

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "No se pudo encontrar el ID del paciente asociado al archivo.",
      });
    }

    const extractedText = await fileService.extractTextFromFile(filePath);
    const analysisResult = await openaiService.processTextWithOpenAI(extractedText, patientId);

    res.status(200).json({
      success: true,
      message: "Análisis procesado y guardado exitosamente",
      data: analysisResult,
    });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar el archivo",
      error: error.message,
    });
  }
};
