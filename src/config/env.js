require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  UPLOAD_DIR: "uploads",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
};
