"use strict";

const appTest = require("./appTest");

module.exports.getPaymentHistory = (options = {}) =>
  appTest.request.get("/api/v1/paymentHistory/")
    .set("Accept", "application/json")
    .query(options.query);

module.exports.addToPaymentHistory = (options = {}) =>
  appTest.request.post("/api/v1/paymentHistory/")
    .set("Accept", "application/json")
    .send(options.body);

module.exports.updatePaymentHistory = (payment_id, options = {}) =>
  appTest.request.put(`/api/v1/paymentHistory/${payment_id}`)
    .set("Accept", "application/json")
    .send(options.body);

module.exports.deletePaymentHistory = (payment_id) =>
  appTest.request.delete(`/api/v1/paymentHistory/${payment_id}`)
    .set("Accept", "application/json");
