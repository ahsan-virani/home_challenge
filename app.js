"use strict";

const express    = require("express"),
      bodyParser = require("body-parser"),
      config     = require("./config/env"),
      health     = require("./api/health"),
      routes     = require("./api/v1/routes");


const app = express();
app.use(bodyParser.json());
app.use(health.healthCheckMiddleware);

app.use("/api/v1", routes);
app.use("/api/health", health.healthCheckHandler);

module.exports = { app };