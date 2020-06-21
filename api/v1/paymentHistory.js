"use strict";

const logger                   = require("../../lib/logger"),
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

function sendBadRequest(req, res, methodName, message) {
  logger.info("[api/v1][%s] Bad request, message: %s, request body: %j", methodName, message, req.body);
  res.status(400).send(message);
}

module.exports = {
  getPaymentHistory,
  addToPaymentHistory
};