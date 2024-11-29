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

/**
 * Guarda el análisis procesado como un archivo JS en la carpeta de salida.
 * @param {string} result - El resultado en formato JSON (string).
 * @returns {string} - Ruta del archivo guardado.
 */
exports.saveAnalysisToFile = (result) => {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const data = JSON.parse(result); // Convertir el string a JSON

    const nombrePaciente =
      data?.data?.["file info"]?.analisis_clinico?.datos_personales?.nombre ||
      "paciente_sin_nombre"; // Nombre predeterminado si falta la propiedad

    const safeFileName = nombrePaciente.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filePath = path.join(outputDir, `${safeFileName}.js`);

    const jsContent = `module.exports = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync(filePath, jsContent, "utf8");

    console.log(`Archivo guardado como: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
    throw error;
  }
};
