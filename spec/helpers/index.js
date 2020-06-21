"use strict";

const _       = require("lodash"),
      mongodb = require("mongodb"),
      mongo   = require("../../lib/mongo");

module.exports.cleanDatabase = () => mongo.PaymentHistory.deleteMany({});

module.exports.generatePaymentObject = fields => _.merge({
  id: 1365,
  contract_id: 17689,
  description: "Rent to be paid",
  value: 100,
  time: "2016-12-09T00:00:00.00Z",
  isImported: false,
  is_deleted: false
}, fields);