const fs = require("fs");
const path = require("path");
const db = require("../config/firebase");

/**
 * Guarda los datos del análisis clínico en Firestore y en una carpeta específica para el paciente.
 * @param {string} patientId - ID del paciente.
 * @param {Object} analysisData - Datos del análisis clínico.
 * @returns {Promise<void>}
 */
exports.saveClinicalAnalysis = async (patientId, analysisData) => {
  try {
    // Ruta base para guardar los análisis
    const baseDir = path.join(__dirname, "../output", patientId);

    // Crear la carpeta del paciente si no existe
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // Guardar en Firebase
    await db.collection("clinical_analyses").doc(patientId).set(analysisData);

    // Guardar el análisis en la carpeta del paciente como archivo JSON
    const filePath = path.join(baseDir, `${Date.now()}_analysis.json`);
    fs.writeFileSync(filePath, JSON.stringify(analysisData, null, 2), "utf8");

    console.log(`Análisis guardado en la carpeta del paciente: ${filePath}`);
  } catch (error) {
    console.error("Error al guardar análisis clínico:", error);
    throw error;
  }
};
