const express = require("express");
const routes = require("./routes");
const responseMiddleware = require("./middlewares/responseMiddleware");

const app = express();

app.use(express.json());
app.use(responseMiddleware);

app.use("/v1", routes);

module.exports = app;
