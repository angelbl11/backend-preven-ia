const fs = require("fs");
const { GOOGLE_API_KEY } = require("../config/env");
const formatOutput = require("./formatOutput");
const { saveClinicalAnalysis } = require("./fileService");
const { getObesityRisk, getDiabetesRisk, getHypertensionRisk } = require("./dataService");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

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

exports.processTextWithGemini = async (text, patientID) => {
  try {
    const archiveError = "El archivo no coincide con un reporte de análisis clínico.";

    const prompt = `Utiliza un formato JSON valido para todas tus respuestas. A continuación, tienes un formato JSON para el análisis clínico. Sigue este formato al procesar los datos y genera un diagnóstico basado en la información proporcionada.
    identifica todos y cada uno de los parametros clinicos en el texto y escribelos en base a la instruccion siguiente:   
    ${JSON.stringify(formatOutput, null, 2)} 
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

    // Eliminar cualquier texto antes de la primera llave { y después de la última llave }
    const startIndex = result.indexOf("{");
    const endIndex = result.lastIndexOf("}") + 1;
    if (startIndex !== -1 && endIndex !== -1) {
      result = result.substring(startIndex, endIndex);
    }

    // Escribir la respuesta limpiada de Gemini en la consola
    console.log("Respuesta limpiada de Gemini:", result);

    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (jsonError) {
      console.error("La respuesta limpiada de Gemini no es un JSON válido:", result);
      throw new Error("La respuesta limpiada de Gemini no es un JSON válido.");
    }

    // Redirigir a la carpeta fija con un archivo genérico
    const fileName = `analysis_${patientID}`;
    await saveClinicalAnalysis(fileName, parsedResult);

    // Llamar a las funciones de riesgo
    const obesityRisk = await getObesityRisk(parsedResult);
    const diabetesRisk = await getDiabetesRisk(parsedResult);
    const hypertensionRisk = await getHypertensionRisk(parsedResult);

    return {
      parsedResult,
      obesityRisk,
      diabetesRisk,
      hypertensionRisk
    };

  } catch (error) {
    console.error("Error processing text with Gemini:", error);
    throw error;
  }
};
