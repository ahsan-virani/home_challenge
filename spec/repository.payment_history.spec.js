"use strict";

const mongodb = require("mongodb"),
      expect  = require("chai").expect,
      helpers = require("./helpers"),
      appTest = require("./helpers/appTest");

let paymentsRepo;

describe("PaymentHistory Repository", () => {
  before(() =>
    appTest.appReady()
      .then(() => paymentsRepo = require("../repository/paymentHistoryRepository"))
  );

  it("should create a payment", async () => {
    const payment = {
      _id: new mongodb.ObjectID(),
      id: 1366,
      contract_id: 17689,
      description: "Rent payment",
      value: 100,
      time: new Date("2016-12-09T00:00:00.00Z"),
      is_imported: false,
      created_at: new Date("2016-12-09T12:57:31.393Z"),
      updated_at: new Date("2016-12-09T12:57:31.393Z"),
      isDeleted: false
    };
    await paymentsRepo.create(payment);

    const result = await paymentsRepo.findById(payment._id);

    expect(result._id.toString()).to.equal(payment._id.toString());
    expect(result).to.eql(payment);
  });

  afterEach(helpers.cleanDatabaseAndCache);
})
;
