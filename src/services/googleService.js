const { GOOGLE_API_KEY } = require("../config/env");
const formatOutput = require("./formatOutput");
const { saveClinicalAnalysis } = require("./fileService");
const { getObesityRisk, getDiabetesRisk, getHypertensionRisk, processTextWithGemini1 } = require("./dataService");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAOBtjjEMn6Bwqkw-hD54Eifx3Zpmgv2II");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "text/plain",
};

exports.processTextWithGemini = async (text, patientID, imc, edad) => {
  try {

    // Llamar a la función de procesamiento de texto con Gemini
    const { parsedResult1 } = await processTextWithGemini1(text);

    // Llamar a las funciones de riesgo
    const obesityRisk = await getObesityRisk(parsedResult1, imc);
    const diabetesRisk = await getDiabetesRisk(parsedResult1);
    const hypertensionRisk = await getHypertensionRisk(parsedResult1, edad);

    const archiveError = "El archivo no coincide con un reporte de análisis clínico.";

    const prompt = `Utiliza un formato JSON valido para todas tus respuestas. A continuación, tienes un formato JSON para el análisis clínico. Sigue este formato al procesar los datos y genera un diagnóstico basado en la información proporcionada.
    identifica todos y cada uno de los parametros clinicos en el texto y escribelos en base a la instruccion siguiente:   
    ${JSON.stringify(formatOutput, null, 2)} 
    Se ha analizado previamente el archivo con sus parametros y se a determindo una probabilidad de enfermedad, si el valor es missing, tu puedes calcularlo con tus medios.
    Obesidad: ${JSON.stringify(obesityRisk, null, 2)}, Diabetes: ${JSON.stringify(diabetesRisk, null, 2)}, Hipertension: ${JSON.stringify(hypertensionRisk, null, 2)},
    Revisa el nombre en el analisis y regresa el nombre del paciente, no el nombre del medico.
    Sigue las instrucciones en el apartado instruccion, no escribas la instruccion en el formato final.
    Asegurate de que los parametros clinicos esten escritos en el formato correcto y que el diagnostico final sea un resumen de los parametros relacionados a la enfermedad y una opinion medica.
    Por favor, llena las secciones con la información extraída y proporcióname un diagnóstico completo.
    El formato JSON debe ser exactamente como se muestra, sin comillas adicionales ni cambios en la estructura.
    Si la información proporcionada no coincide con un análisis clínico, regresa exactamente "${archiveError}"`;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const response = await chatSession.sendMessage(prompt + "\n" + text);
    let result = response.response.text();

    // Escribir la respuesta de Gemini en la consola
    console.log("Primera respuesta de Gemini:", result);

    // Limpiar la respuesta de Gemini
    result = cleanGeminiResponse(result);

    // Parsear la respuesta de Gemini
    const parsedResult = parseGeminiResponse(result);

    // Guardar el análisis clínico
    await saveClinicalAnalysis(`analysis_${patientID}`, parsedResult);

    return { parsedResult };

  } catch (error) {
    console.error("Error processing text with Gemini:", error);
    throw error;
  }
};

function cleanGeminiResponse(result) {
  const startIndex = result.indexOf("{");
  const endIndex = result.lastIndexOf("}") + 1;
  if (startIndex !== -1 && endIndex !== -1) {
    result = result.substring(startIndex, endIndex);
  }
  console.log("Respuesta limpiada de Gemini:", result);
  return result;
}

function parseGeminiResponse(result) {
  try {
    return JSON.parse(result);
  } catch (jsonError) {
    console.error("La respuesta limpiada de Gemini no es un JSON válido:", result);
    throw new Error("La respuesta limpiada de Gemini no es un JSON válido.");
  }
}
