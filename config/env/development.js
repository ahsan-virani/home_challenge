"use strict";

const _ = require("lodash");

module.exports = {
  database: {
    mongodb: {
      home_challenge: {
        url: "mongodb://localhost:27017",
        db: "home_challenge",
        authenticate: false,
        models: [
          { name: "PaymentHistory", collection: "paymentHistory", hints: "repository/paymentHistoryRepository/hints" }
        ]
      }
    }
  },
  mongodb: {
    connectTimeoutMS: 60000,
    socketTimeoutMS: 30000,
    maxTimeMS: 2000,
    haInterval: 1000
  },
  logging: {
    logLevel: "info"
  }
};
