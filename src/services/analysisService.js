const { db } = require("../config/firebase");

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
