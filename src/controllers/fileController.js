const { extractTextFromFile } = require("../services/fileService");
const { processTextWithOpenAI } = require("../services/openaiService");

exports.processFile = async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.errorResponse("No file provided.", 400);
    }

    const text = await extractTextFromFile(file.path);

    // ID fijo del paciente por ahora
    const patientId = "e9sAfzwRNfkQOZ99AALkXOxmWsJO2";

    // Pasar el ID del paciente al servicio
    const result = await processTextWithOpenAI(text, patientId);

    return res.successResponse(result, "Analysis processed successfully.");
  } catch (error) {
    console.error("Error processing file:", error);
    return res.errorResponse(error.message || "File processing failed.");
  }
};
