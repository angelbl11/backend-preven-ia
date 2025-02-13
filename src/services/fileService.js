const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { db } = require("../config/firebase");

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


/**
 * Guarda un análisis clínico en una colección fija en Firestore.
 * @param {string} fileName - Nombre del archivo que será guardado.
 * @param {object} analysisData - Datos del análisis clínico.
 */
exports.saveClinicalAnalysis = async (fileName, analysisData) => {
  try {
    // Nueva carpeta fija para guardar los análisis
    const collectionName = "clinical_analyses";

    const docRef = db.collection(collectionName).doc(fileName);
    await docRef.set(analysisData);

    console.log(`Análisis clínico guardado en Firestore en ${collectionName}/${fileName}`);
  } catch (error) {
    console.error("Error al guardar el análisis clínico:", error);
    throw error;
  }
};
