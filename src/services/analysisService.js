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

/**
 * Obtiene el ID del paciente asociado a un archivo desde Firebase.
 * @param {string} fileId - Identificador único del archivo.
 * @returns {Promise<string>} - ID del paciente asociado.
 */
exports.getPatientIdFromFile = async (fileId) => {
  try {
    const fileDoc = await db.collection("uploaded_files").doc(fileId).get();

    if (!fileDoc.exists) {
      console.error(`No se encontró el archivo con ID: ${fileId}`);
      return null;
    }

    const fileData = fileDoc.data();
    return fileData.patientId || null; // Retorna el ID del paciente si existe
  } catch (error) {
    console.error("Error al obtener el ID del paciente desde Firebase:", error);
    throw error;
  }
};
