"use strict";

const _      = require("lodash"),
      logger = require("../lib/logger");

module.exports = (err, req, res, next) => {
  const isBodyEmpty = _.isEmpty(req.body);
  const logMessage = "Error - Method: %s, Path: %s, " + (isBodyEmpty ? "Query" : "Body") + ": %j";

  logger.error(logMessage, req.method, req.path, isBodyEmpty ? req.query : req.body, err);

  res.status(500).end();
};
