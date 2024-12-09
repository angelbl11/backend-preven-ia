const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { db } = require("../config/firebase");

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

/**
 * Guarda el contenido extraído en Firestore.
 * @param {string} documentId - ID del documento en Firestore.
 * @param {string} textContent - Contenido extraído del PDF.
 */
exports.saveContentDb = async (content, documentId) => {
  try {
    if (!content || !documentId) {
      throw new Error("El contenido y el ID del documento son obligatorios.");
    }

    // Referencia a la colección "pdf_contents" con el documento específico
    const docRef = db.collection("pdf_contents").doc(documentId);

    // Guardar el contenido como un campo en el documento
    await docRef.set({
      content,
      timestamp: new Date(),
    });

    console.log(`Contenido guardado en Firestore con ID: ${documentId}`);
  } catch (error) {
    console.error("Error al guardar el contenido en Firestore:", error);
    throw error;
  }
};