"use strict";

const _ = require("lodash");

const all = {
  env: process.env.NODE_ENV || "development",
  port: 3000
};

module.exports = _.merge(all, require("./" + all.env + ".js"));
