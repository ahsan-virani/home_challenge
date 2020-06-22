"use strict";

const _                        = require("lodash"),
      logger                   = require("../../lib/logger"),
      paymentHistoryController = require("../../controller/paymentHistoryController");

const getPaymentHistory = async (req, res, next) => {
  const { contractId, startDate, endDate } = req.query;

  if (!contractId) {
    sendBadRequest(req, res, "getPaymentHistory", "missing contract ID");
    return;
  }

  if (!startDate) {
    sendBadRequest(req, res, "getPaymentHistory", "missing start date");
    return;
  }

  if (!endDate) {
    sendBadRequest(req, res, "getPaymentHistory", "missing end date");
    return;
  }

  let paymentHistory;
  try {
    paymentHistory = await paymentHistoryController.getPaymentHistory(parseInt(contractId), startDate, endDate);
  } catch (err) {
    next(err);
    return;
  }

  res.json(paymentHistory);
};

const addToPaymentHistory = async (req, res, next) => {
  const { payment } = req.body;

  if (!payment) {
    sendBadRequest(req, res, "addToPaymentHistory", "missing payment data");
    return;
  }

  let createdPayment;
  try {
    createdPayment = await paymentHistoryController.addToPaymentHistory(payment);
  } catch (err) {
    next(err);
    return;
  }

  res.json(createdPayment);
};

const ALLOWED_UPDATE_FIELDS = ["is_deleted", "value"];

const updatePaymentHistory = async (req, res, next) => {
  const { id } = req.params,
        update = _.pick(req.body, ALLOWED_UPDATE_FIELDS);

  if (!id || id === "undefined") {
    sendBadRequest(req, res, "updatePaymentHistory", "missing update id");
    return;
  }

  if (!update || _.size(update) < 1) {
    sendBadRequest(req, res, "updatePaymentHistory", "missing payment update data");
    return;
  }

  let updatedPayment;
  try {
    updatedPayment = await paymentHistoryController.updatePaymentHistory(parseInt(id), update);
  } catch (err) {
    next(err);
    return;
  }

  if (!updatedPayment) {
    res.status(404).send("payment not found");
    return;
  }

  res.json(_.merge(updatedPayment, update));
};

function sendBadRequest(req, res, methodName, message) {
  logger.info("[api/v1][%s] Bad request, message: %s, request body: %j", methodName, message, req.body);
  res.status(400).send(message);
}

module.exports = {
  getPaymentHistory,
  addToPaymentHistory,
  updatePaymentHistory
};