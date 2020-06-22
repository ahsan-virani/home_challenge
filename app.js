"use strict";

const express    = require("express"),
      bodyParser = require("body-parser"),
      moment     = require("moment"),
      config     = require("./config/env"),
      logger     = require("./lib/logger"),
      health     = require("./api/health"),
      routes     = require("./api/v1/routes");


const app = express();
app.use(bodyParser.json());
app.use(health.healthCheckMiddleware);

app.use("/api/v1", routes);
app.use("/api/health", health.healthCheckHandler);

process.on("uncaughtException", err => logger.error("Uncaught exception", err));
process.on("unhandledRejection", (err, promise) => logger.error("Unhandled rejection - Promise: %j", promise, err));

if (require.main === module) {
  app.listen(config.port, config.ip, function () {
    console.log("========================================================================");
    console.log("");
    console.log("  Starting Home Challenge Service on " + moment().format("HH:mm:ss DD-MM-YYYY"));
    console.log("      Environment: " + config.env);
    console.log("            Port: " + config.port);
    console.log("");
    console.log("========================================================================");
  });
}

module.exports = { app };