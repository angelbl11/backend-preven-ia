const fs = require("fs");
const pdf = require("pdf-parse");

exports.extractTextFromFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from file:", error);
  }
};
