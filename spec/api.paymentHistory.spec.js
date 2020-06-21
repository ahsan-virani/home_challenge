"use strict";

const _           = require("lodash"),
      mongodb     = require("mongodb"),
      expect      = require("chai").expect,
      apiRequests = require("./helpers/apiRequests"),
      helpers     = require("./helpers"),
      appTest     = require("./helpers/appTest");

let paymentsRepo;

describe("Payment History", () => {
  before(() =>
    appTest.appReady()
      .then(() => paymentsRepo = require("../repository/paymentHistoryRepository"))
  );

  describe("GET v1/paymentHistory", () => {

    it("should fail if bad request", async () => {
      let result = await apiRequests.getPaymentHistory().expect(400);
      expect(result.error.text).eql("missing contract ID");

      result = await apiRequests.getPaymentHistory({ query: { contractId: 12 } }).expect(400);
      expect(result.error.text).eql("missing start date");

      result = await apiRequests.getPaymentHistory({ query: { contractId: 12, startDate: "2018" } }).expect(400);
      expect(result.error.text).eql("missing end date");

      // cases for bad dates etc to add here
    });


    it("should get payment history", async () => {
      const payments = [
        helpers.generatePaymentObject({
          _id: new mongodb.ObjectID(),
          contract_id: 17689,
          value: 100,
          time: new Date("2016-12-09T00:00:00.00Z"),
        }),
        helpers.generatePaymentObject({
          _id: new mongodb.ObjectID(),
          contract_id: 17689,
          value: -100,
          time: new Date("2016-12-10T00:00:00.00Z"),
        }),
        helpers.generatePaymentObject({
          _id: new mongodb.ObjectID(),
          contract_id: 17689,
          value: 50,
          time: new Date("2016-12-11T00:00:00.00Z"),
        }),
        helpers.generatePaymentObject({
          _id: new mongodb.ObjectID(),
          contract_id: 17690,
          value: -100,
          time: new Date("2016-12-10T00:00:00.00Z"),
        })
      ];

      await Promise.all(payments.map(payment => paymentsRepo.create(payment)));

      const result = await apiRequests.getPaymentHistory({
        query: {
          contractId: 17689,
          startDate: "2016-12-09T00:00:00.00Z",
          endDate: "2016-12-11T00:00:00.00Z"
        }
      }).expect(200);

      expect(result.body.sum).to.eql(50);
      expect(result.body.payments.length).eql(3);
      expect(result.body.payments[0]._id).eql(payments[0]._id.toString());
      expect(result.body.payments[0].contract_id).eql(payments[0].contract_id);

    });
  });

  describe("POST v1/paymentHistory", () => {
    it("should fail if bad request", async () => {
      const result = await apiRequests.addToPaymentHistory().expect(400);
      expect(result.error.text).eql("missing payment data");

      // todo add failed validation cases
    });

    it("should add payment history item", async () => {
      const payment = helpers.generatePaymentObject(),
            result  = await apiRequests.addToPaymentHistory({
              body: {
                payment
              }
            }).expect(200);

      expect(result.body.id).eql(payment.id);
      expect(result.body.contract_id).eql(payment.contract_id);
    });
  });

  afterEach(helpers.cleanDatabase);
})
;
