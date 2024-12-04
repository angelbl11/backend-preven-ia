const { db } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

exports.saveClinicalAnalysis = async (patientId, analysisData) => {
  try {
    const patientRef = db.collection("patients").doc(patientId); // Referencia al documento del paciente
    const analysisId = uuidv4(); // Generar un ID único para el análisis

    // Guardar los datos del análisis en la subcolección del paciente
    await patientRef.collection("clinical_analyses").doc(analysisId).set({
      ...analysisData,
      createdAt: new Date().toISOString(),
    });

    console.log(`Análisis clínico guardado para el paciente ${patientId}`);
  } catch (error) {
    console.error("Error al guardar análisis clínico:", error);
    throw error;
  }
};
