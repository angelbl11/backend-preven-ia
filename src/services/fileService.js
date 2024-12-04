const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

// Define el directorio de salida
const outputDir = path.join(__dirname, "../output");

// Verifica si el directorio existe; si no, lo crea
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Extrae texto de un archivo PDF.
 * @param {string} filePath - Ruta del archivo PDF.
 * @returns {Promise<string>} - Texto extraído del PDF.
 */
exports.extractTextFromFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath); // Lee el archivo PDF como un buffer
    const data = await pdf(dataBuffer); // Procesa el PDF y extrae texto
    return data.text; // Devuelve el texto extraído
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error; // Lanza el error para manejo en niveles superiores
  }
};
