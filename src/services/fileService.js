const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const outputDir = path.join(__dirname, "../output");

/**
 * Extrae texto de un archivo PDF.
 * @param {string} filePath - Ruta del archivo PDF.
 * @returns {Promise<string>} - Texto extraído del PDF.
 */
exports.extractTextFromFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
};
