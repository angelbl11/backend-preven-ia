const { GOOGLE_API_KEY } = require("../config/env");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

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

async function processTextWithGemini1(text) {
  try {
    const archiveError = "El archivo no coincide con un reporte de análisis clínico.";

    const prompt = `Utiliza un formato JSON valido para todas tus respuestas. A continuación, tienes un formato JSON para el análisis clínico. Sigue este formato al procesar los datos y genera un diagnóstico basado en la información proporcionada.
    identifica todos y cada uno de los parametros clinicos en el texto y escribelos en base a la instruccion siguiente:  
    clinical_parameters: {
      instruccion: "No escribas el apartado de instruccion en el formato final. Sigue el siguiente formato para los parametros clinicos, si son varias palabras separalas por un guion bajo, no encierres los parametros entre comillas solo redactalos como un objeto JSON, escribe tantos parametros como haya en el analisis clinico, que cada parametro quede como un objeto respetando el siguiente formato:",
      parametro_1: "",
      parametro_2: "",
      parametro_n: ""
    } 
    Escribe los parametros correspondientes al analisis clinico en el siguiente formato, ldl es low density lipoprotein, trigliceridos es triglycerides, glucosa_ayunas es fasting glucose, insulina es insulin, hba1c es hemoglobin a1c, presion_arterial_sistolica es systolic blood pressure, presion_arterial_diastolica es diastolic blood pressure, creatinina es creatinine, condicion_genetica es genetic condition: 
    ldl
    trigliceridos
    glucosa_ayunas
    insulina
    hba1c
    presion_arterial_sistolica
    presion_arterial_diastolica
    creatinina
    condicion_genetica

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
    console.log("Respuesta de Gemini:", result);

    // Eliminar cualquier texto antes de la primera llave { y después de la última llave }
    const startIndex = result.indexOf("{");
    const endIndex = result.lastIndexOf("}") + 1;
    if (startIndex !== -1 && endIndex !== -1) {
      result = result.substring(startIndex, endIndex);
    }

    let parsedResult1;
    try {
      parsedResult1 = JSON.parse(result);
    } catch (jsonError) {
      console.error("La respuesta limpiada de Gemini no es un JSON válido:", result);
      throw new Error("La respuesta limpiada de Gemini no es un JSON válido.");
    }

    return {
      parsedResult1
    };

  } catch (error) {
    console.error("Error processing text with Gemini:", error);
    throw error;
  }
}

async function fetchRisk(endpoint, data) {
  try {
    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching risk from ${endpoint}:`, error);
    throw error;
  }
}

async function getObesityRisk(result, imc) {
  if (!result) {
    return "Missing";
  }

  const { ldl, trigliceridos, glucosa_ayunas, condicion_genetica = null } = result;

  if (ldl === undefined || trigliceridos === undefined || glucosa_ayunas === undefined) {
    return "Missing";
  }

  const data = { imc, ldl, trigliceridos, glucosa_ayunas, condicion_genetica };
  const endpoint = 'https://ml-preven-ia-production.up.railway.app/predict/obesity';
  return fetchRisk(endpoint, data);
}

async function getDiabetesRisk(result) {
  if (!result) {
    return "Missing";
  }

  const { glucosa_ayunas, hba1c, condicion_genetica = null } = result;

  if (glucosa_ayunas === undefined || insulina === undefined || hba1c === undefined) {
    return "Missing";
  }

  const data = { glucosa_ayunas, hba1c, condicion_genetica };
  const endpoint = 'https://ml-preven-ia-production.up.railway.app/predict/diabetes';
  return fetchRisk(endpoint, data);
}

async function getHypertensionRisk(result, edad) {
  if (!result) {
    return "Missing";
  }

  const { presion_arterial_sistolica, presion_arterial_diastolica, creatinina, ldl, condicion_genetica = null } = result;

  if (presion_arterial_sistolica === undefined || presion_arterial_diastolica === undefined || creatinina === undefined || ldl === undefined) {
    return "Missing";
  }

  const data = { presion_arterial_sistolica, presion_arterial_diastolica, creatinina, ldl, condicion_genetica, edad };
  const endpoint = 'https://ml-preven-ia-production.up.railway.app/predict/hipertension';
  return fetchRisk(endpoint, data);
}

module.exports = {
  getObesityRisk,
  getDiabetesRisk,
  getHypertensionRisk,
  processTextWithGemini1
};