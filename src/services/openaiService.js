const fs = require("fs");
const path = require("path");
const { OPENAI_API_KEY } = require("../config/env");
const formatOutput = require("./formatOutput");

let OpenAI;

(async () => {
  const { OpenAI: ImportedOpenAI } = await import("openai");
  OpenAI = ImportedOpenAI;
})();

exports.processTextWithOpenAI = async (text) => {
  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const archiveError = "El archivo no coincide con un reporte de análisis clínico.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    console.log("Estructura del JSON devuelto:", parsedResult);

    const outputDir = path.join(__dirname, "../output");

    // Intentar acceder al nombre del paciente desde el JSON
    const nombrePaciente =
      parsedResult?.analisis_clinico?.datos_personales?.nombre ||
      parsedResult?.data?.["file info"]?.analisis_clinico?.datos_personales?.nombre ||
      "paciente_sin_nombre";

    if (nombrePaciente === "paciente_sin_nombre") {
      console.warn("No se encontró el nombre del paciente en los datos.");
    }

    // Crear un nombre de archivo seguro
    const safeFileName = nombrePaciente.replace(/[^a-z0-9]/gi, "_").toLowerCase(); 
    const fileName = `${safeFileName}.js`;
    const filePath = path.join(outputDir, fileName);

    // Crear el directorio si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Formatear el contenido como un módulo JS
    const formattedResult = `module.exports = ${JSON.stringify(parsedResult, null, 2)};`;

    fs.writeFileSync(filePath, formattedResult, "utf8");

    console.log(`Resultado guardado en: ${filePath}`);
    return parsedResult;
  } catch (error) {
    console.error("Error processing text with OpenAI:", error);
    throw error;
  }
};
