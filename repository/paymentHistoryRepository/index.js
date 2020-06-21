"use strict";

const _       = require("lodash"),
      mongodb = require("mongodb"),
      hints   = require("./hints"),
      config  = require("../../config/env"),
      logger  = require("../../lib/logger"),
      mongo   = require("../../lib/mongo");

const logDBError = err => {
  logger.error("[paymentHistoryRepository]", err);
  throw err;
};

module.exports.findById = id =>
  mongo.PaymentHistory.findOne(
    { _id: new mongodb.ObjectId(id) },
    { hint: hints.ID, maxTimeMS: config.mongodb.maxTimeMS }
  )
    .catch(logDBError);

module.exports.findByDatesAndContractId = (contractId, startDate, endDate, fields) => {

  const query = { is_deleted: { $ne: true }, contract_id: contractId, time: { $gte: startDate, $lte: endDate } };

  return module.exports.findMany(query, fields, hints.CONTRACT_ID_CREATED_AT);
};

module.exports.create = async payment => {
  payment._id = new mongodb.ObjectID();
  return mongo.PaymentHistory
    .insertOne(payment)
    .then(result => result.ops[0])
    .catch(logDBError);
};

module.exports.findMany = (query, projection, hint, { sort, limit } = {}) => {
  const options = {
    hint,
    sort,
    limit,
    projection,
    maxTimeMS: config.mongodb.maxTimeMS
  };

  return mongo.PaymentHistory
    .find(query, options)
    .toArray()
    .catch(logDBError);
};