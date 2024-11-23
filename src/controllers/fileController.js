const fileService = require("../services/fileService");
const fs = require("fs");

exports.processFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    const text = await fileService.extractTextFromFile(filePath);

    fs.unlinkSync(filePath);

    res.successResponse({ "file info": text }, "File processed successfully");
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
