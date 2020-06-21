"use strict";

const mongo  = require("../../lib/mongo");

module.exports.cleanDatabaseAndCache = () => mongo.PaymentHistory.deleteMany({});