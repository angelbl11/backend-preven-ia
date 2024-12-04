const fileService = require("../services/fileService");
const openaiService = require("../services/openaiService");
const fs = require("fs");

exports.processFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const text = await fileService.extractTextFromFile(filePath);

    // Llamar a OpenAI
    const openAIResponse = await openaiService.processTextWithOpenAI(text);

    // Eliminar archivo después de procesarlo
    fs.unlinkSync(filePath);

    res.successResponse(
      openAIResponse,
      "File processed and analyzed successfully"
    );
  } catch (error) {
    if (!req.file) {
      res.errorResponse(
        "No file selected",
        400,
        "No se seleccionó ningún archivo"
      );
    } else {
      res.errorResponse(error.message, 500);
    }
  }
};
