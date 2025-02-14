require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  UPLOAD_DIR: "uploads",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
};
