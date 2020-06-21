"use strict";

const appTest = require("./appTest");

module.exports.getPaymentHistory = (options = {}) =>
  appTest.request.get("/api/v1/paymentHistory")
    .set("Accept", "application/json")
    .query(options.query);
