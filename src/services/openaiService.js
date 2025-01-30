const fs = require("fs");
const { OPENAI_API_KEY } = require("../config/env");
const formatOutput = require("./formatOutput");
const { saveClinicalAnalysis } = require("./fileService");

let OpenAI;

(async () => {
  const { OpenAI: ImportedOpenAI } = await import("openai");
  OpenAI = ImportedOpenAI;
})();

exports.processTextWithOpenAI = async (text, patientID) => {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const archiveError = "El archivo no coincide con un reporte de análisis clínico.";

    const response = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0125:prevenia:obesityml:AtgX71sA",
      messages: [
        {
          role: "system",
          content: `A continuación, tienes un formato JSON para el análisis clínico. Sigue este formato al procesar los datos y genera un diagnóstico basado en la información proporcionada.
          identifica todos y cada uno de los parametros clinicos en el texto y escribelos en base a la instruccion siguiente:   
          ${JSON.stringify(formatOutput, null, 2)} 
          Sigue las instrucciones en el apartado instruccion, no escribas la instruccion en el formato final.
          Por favor, llena las secciones con la información extraída y proporcióname un diagnóstico completo.
          Si la información proporcionada no coincide con un análisis clínico, regresa exactamente "${archiveError}"`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = response.choices[0].message.content;

    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (jsonError) {
      console.error("Respuesta no válida como JSON:", result);
      throw new Error("La respuesta de OpenAI no es un JSON válido.");
    }

   // Redirigir a la carpeta fija con un archivo genérico
   const fileName = `analysis_${patientID}`;
   await saveClinicalAnalysis(fileName, parsedResult);

   return parsedResult;

  } catch (error) {
    console.error("Error processing text with OpenAI:", error);
    throw error;
  }
};
