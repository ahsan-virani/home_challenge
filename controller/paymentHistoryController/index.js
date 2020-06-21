const _                        = require("lodash"),
      paymentHistoryRepository = require("../../repository/paymentHistoryRepository");

module.exports.getPaymentHistory = async (contractId, startDate, endDate) => {
  const from = new Date(startDate),
        till = new Date(endDate);

  const payments = await paymentHistoryRepository.findByDatesAndContractId(contractId, from, till),
        sum      = _.reduce(payments, (total, payment) => total + (payment.value || 0), 0);

  return { sum, payments };
};

module.exports.addToPaymentHistory = paymentData => {
  // todo validate paymentData with schema

  paymentData.created_at = new Date();

  return paymentHistoryRepository.create(paymentData);
};