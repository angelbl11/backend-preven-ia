const { extractTextFromFile } = require("../services/fileService");
const { processTextWithGemini } = require("../services/googleService");
const { db } = require("../config/firebase");

/**
 * Función auxiliar para obtener los datos del paciente desde Firebase.
 * @param {string} patientID - ID del paciente.
 * @returns {object} - Datos del paciente.
 * @throws {Error} - Si el paciente no se encuentra o si el patientID no es proporcionado.
 */
async function fetchPatientData(patientID) {
  if (!patientID) {
    throw new Error("El patientID es obligatorio para obtener los datos del paciente.");
  }

  const patientDoc = await db.collection("users").doc(patientID).get();

  if (!patientDoc.exists) {
    throw new Error("Paciente no encontrado.");
  }

  return patientDoc.data();
}

/**
 * Procesa un archivo PDF y guarda el análisis clínico.
 */
exports.processFile = async (req, res) => {
  try {
    const patientID = req.body.patientID;

    // Obtener los datos del paciente desde Firebase
    const patientData = await fetchPatientData(patientID);
    const imc = patientData.imc;
    const birthDate = patientData.birth_date;

    if (!imc) {
      throw new Error("El IMC del paciente no está disponible.");
    }

    if (!birthDate) {
      throw new Error("La fecha de nacimiento del paciente no está disponible.");
    }

    // Calcular la edad del paciente
    const age = calculateAge(birthDate);

    const filePath = req.file.path; // Ruta del archivo subido
    const extractedText = await extractTextFromFile(filePath);
    const analysisResult = await processTextWithGemini(extractedText, patientID, imc, age);

    res.status(200).json({
      success: true,
      message: "Archivo procesado y análisis clínico guardado exitosamente.",
      data: analysisResult,
    });
  } catch (error) {
    console.error("Error procesando el archivo:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Calcula la edad a partir de la fecha de nacimiento.
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD.
 * @returns {number} - Edad calculada.
 */
function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
