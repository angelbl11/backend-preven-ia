const { OpenAI } = require("openai");
const { OPENAI_API_KEY } = require("../config/env");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

exports.processTextWithOpenAI = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Keep this model for economic reasons (it's cheaper)
      messages: [
        {
          role: "system",
          content: "Hello, world!",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = response.choices[0].message.content;
    return JSON.parse(result);
  } catch (error) {
    console.error("Error processing text with OpenAI:", error);
  }
};
