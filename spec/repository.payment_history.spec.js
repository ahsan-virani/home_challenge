"use strict";

const _       = require("lodash"),
      mongodb = require("mongodb"),
      expect  = require("chai").expect,
      moment  = require("moment"),
      hints   = require("../repository/paymentHistoryRepository/hints"),
      helpers = require("./helpers"),
      appTest = require("./helpers/appTest");

let paymentsRepo;

describe("PaymentHistory Repository", () => {
  before(() =>
    appTest.appReady()
      .then(() => paymentsRepo = require("../repository/paymentHistoryRepository"))
  );

  beforeEach(() => {
    const payments = [
      helpers.generatePaymentObject({
        id: 1366,
        contract_id: 17689,
        description: "Rent payment",
        value: 100,
        time: "2016-12-09T00:00:00.00Z",
        is_imported: false,
        created_at: "2016-12-09T12:57:31.393Z",
        updated_at: "2016-12-09T12:57:31.393Z",
        is_deleted: false
      }),
      helpers.generatePaymentObject({
        id: 1365,
        contract_id: 17689,
        description: "Rent to be paid",
        value: -100,
        time: "2016-12-09T00:00:00.00Z",
        is_imported: false,
        createdAt: "2016-12-09T12:57:09.708Z",
        updatedAt: "2016-12-09T12:57:09.709Z",
        is_deleted: false
      }),
      helpers.generatePaymentObject({
        id: 13213,
        contract_id: 17689,
        description: "Rent to be paid",
        value: -100,
        time: "2016-12-09T00:00:00.00Z",
        isImported: false,
        createdAt: "2016-12-09T12:57:09.708Z",
        updatedAt: "2016-12-09T12:57:09.709Z",
        is_deleted: true
      })
    ];

    return Promise.all(_.map(payments, payment => paymentsRepo.create(payment)));
  });

  it("should create a payment", async () => {
    const payment = helpers.generatePaymentObject({
      id: 1367,
      contract_id: 17690,
      description: "Rent payment new",
      value: 101
    });
    await paymentsRepo.create(payment);

    const result = await paymentsRepo.findById(payment._id);
    expect(result).to.eql(payment);
  });

  it("should find payments", async () => {
    const result = await paymentsRepo.findMany({}, { _id: 1, contract_id: 1, id: 1 });
    expect(result.length).to.eql(3);
  });

  it("should find payments by contract id and date correctly", async () => {
    let result = await paymentsRepo.findByDatesAndContractId(17689, "2016-12-09T00:00:00.00Z", "2016-12-09T00:00:00.00Z");
    expect(result.length).eql(2);

    result = await paymentsRepo.findByDatesAndContractId(17680, "2016-12-09T00:00:00.00Z", "2016-12-09T00:00:00.00Z");
    expect(result.length).eql(0);

    result = await paymentsRepo.findByDatesAndContractId(17689, "2016-12-07T00:00:00.00Z", "2016-12-08T00:00:00.00Z");
    expect(result.length).eql(0);
  });

  it("should update payment by id correctly", async () => {
    let result = await paymentsRepo.updatePaymentById(1365, { is_deleted: true, value: 250 });
    expect(result.id).eql(1365);
    expect(result.updated_at).eql(undefined);

    const updatedValue = await paymentsRepo.findById(result._id.toString());
    expect(updatedValue.value).eql(250);
    expect(updatedValue.is_deleted).eql(true);
    expect(moment(updatedValue.updated_at).isAfter(moment().subtract(1, "hour"))).eql(true);
  });

  afterEach(helpers.cleanDatabase);
})
;
