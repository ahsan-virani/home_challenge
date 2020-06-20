/*globals __dirname, after, afterEach, before, beforeEach, Buffer, describe, it, process, require*/
"use strict";

const sinon   = require("sinon"),
      appTest = require("./helpers/appTest"),
      mongo   = require("../lib/mongo");

describe("The health check endpoint", () => {
  let sandbox;

  before(appTest.appReady);
  beforeEach(() => sandbox = sinon.createSandbox());

  it("should send OK when all services are up", () => {
    return appTest.request.get("/api/health")
      .expect(200);
  });

  it("should send NOK when the MongoDB connection is down", () => {
    sandbox.stub(mongo, "isConnected")
      .onCall(0).returns(false)
      .onCall(1).returns(false)
      .returns(true);

    return appTest.request.get("/api/health").expect(503)
      .then(() => appTest.request.get("/api/health").expect(200));
  });

  it("should fail requests when application is not healthy", () => {
    sandbox.stub(mongo, "isConnected")
      .returns(false);

    return appTest.request.get("/api/internal/promotedPost").expect(503);
  });

  afterEach(() => sandbox.restore());
});
