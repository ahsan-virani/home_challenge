"use strict";

const util    = require("util"),
      _       = require("lodash"),
      winston = require("winston"),
      config  = require("../config/env");

const LEVELS = {
  info: 1,
  error: 2
};

const COLORS = {
  info: "blue",
  error: "red"
};

const transports = [
  new winston.transports.Console(
    {
      level: config.logging.logLevel,
      colorize: true,
      prettyPrint: true
    })
];

const logger = winston.createLogger({
  transports: transports
});

logger.setLevels(LEVELS);
winston.addColors(COLORS);

_.forEach(LEVELS, function (value, key) {

  const currentMethod = logger[key];
  logger[key] = function () {
    currentMethod(util.format.apply(util, arguments));
  };

});

const errorFn = logger.error;
logger.error = function () {
  let args = arguments;

  if (arguments.length > 1) {
    args = new Array(arguments.length + 2); // 2 more elements for error.
    for (let i = 0; i < arguments.length; ++i) {
      args[i] = arguments[i];
    }

    // Error should be the last argument.
    const error = arguments[arguments.length - 1];
    args[0] = args[0] + " - Message: %s, Error: %j, Stack: %s";
    args[args.length - 3] = _.get(error, "message", error);
    args[args.length - 2] = error; // Duplicating error.
    args[args.length - 1] = _.get(error, "stack");
  }

  errorFn.apply(null, args);
};

module.exports = logger;
