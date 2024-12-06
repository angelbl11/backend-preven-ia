const express = require("express");
const routes = require("./routes");
const responseMiddleware = require("./middlewares/responseMiddleware");
const analysisRoutes = require("./routes/fileRoutes");

const app = express();

app.use(express.json());
app.use(responseMiddleware);

app.use("/v1", routes);

app.use("/v1/clinical-analyses", analysisRoutes);

module.exports = app;
