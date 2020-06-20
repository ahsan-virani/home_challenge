"use strict";

const http      = require("http"),
      supertest = require("supertest"),
      mongo     = require("../../lib/mongo");

module.exports.wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let ready = false;
module.exports.appReady = async () => {
  if (ready) {
    return;
  }

  for (let i = 0; i < 30; i++) {
    await module.exports.wait(1000);
    try {
      await mongo.isConnected("home_challenge");
      break; // If this line is reached, mongo is connected.
    } catch (err) {
      logger.info("[appTest][appReady] Waiting for MongoDB to be ready");
    }
  }

  await mongo.__ensureIndexes();
  await mongo.collectionsReady;
  ready = true;
};

const { app } = require("../../app");

const server = http.createServer(app);
server.listen(3000);

exports.request = supertest(app);
