"use strict";

const _      = require("lodash"),
      logger = require("../lib/logger"),
      mongo  = require("../lib/mongo");

const stateDescription = {
  "MongoDB": () => mongo.isConnected("home_challenge")
};

exports.healthCheckHandler = function (req, res) {
  if (healthy()) {
    res.status(200).end("OK");
  } else {
    logger.info("[API][healthCheckHandler] State: %j", currentState());
    res.status(503).end("Unhealthy");
  }
};

exports.healthCheckMiddleware = function (req, res, next) {
  // Exclude health check API.
  if (req.path === "/api/health" || healthy()) {
    next();
    return;
  }

  logger.info("[health][checkHealthMiddleware] Health check failed, aborting request - Path: %s, App State: %j", req.path, currentState());
  res.status(503).send("Service Unavailable");
};

function healthy() {
  return _.every(stateDescription, f => f());
}

function currentState() {
  return _.mapValues(stateDescription, f => f());
}
