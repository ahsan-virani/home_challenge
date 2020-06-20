"use strict";

const _              = require("lodash"),
      ObjectID       = require("mongodb").ObjectID,
      MongoClient    = require("mongodb").MongoClient,
      ReadPreference = require("mongodb").ReadPreference,
      config         = require("../config/env"),
      logger         = require("../lib/logger");

const databases = config.database.mongodb;

const state = {
  databases: {}
};

module.exports.collectionsReady = Promise.all(Object.keys(databases).map(async dbName => {
  const dbConf = databases[dbName];
  const db = await setupConnection(dbName, dbConf.url);
  return await initCollections(db, dbName, dbConf);
}));

async function initCollections(db, dbName, dbConf) {
  dbConf.models.forEach(modelConf => {
    if (!modelConf.collection) {
      return;
    }

    logger.info("[Mongo] Adding Collection: %s, DB: %s", modelConf.collection, dbName);
    module.exports[modelConf.name] = db.collection(modelConf.collection);
  });
}

async function setupConnection(dbName, url) {
  logger.info("[Mongo][setupConnection] Connecting to Database: %s - %s", dbName, url);

  const options = {
    poolSize: 50,
    autoReconnect: true,
    keepAlive: 1,
    readPreference: config.mongodb.readPreference,
    connectTimeoutMS: config.mongodb.connectTimeoutMS,
    //socketTimeoutMS: config.mongodb.socketTimeoutMS,
    haInterval: config.mongodb.haInterval,
    useNewUrlParser: true
  };

  try {
    const client = await MongoClient.connect(url, options);
    const db = client.db(dbName);
    logger.info("[Mongo][setupConnection] Connected to Database: %s - %s", dbName, url);

    await initEventListeners(db, dbName, url);
    logger.info("[Mongo][setupConnection] Event listeners set for: %s - %s", dbName, url);

    state.databases[dbName] = client;

    return db;
  } catch (err) {
    logger.error("[Mongo][setupConnection] Error while connecting: %s - %s", dbName, url, err);

    // NOTE: Always attempt to retry.
    return await setupConnection(dbName, url);
  }
}

function initEventListeners(db, dbName, url) {
  db.on("close", event => logger.info("[Mongo][close] Database: %s, Url: %s, Event: %j", dbName, url, event));
  db.on("error", event => logger.info("[Mongo][error] Database: %s, Url: %s, Event: %j", dbName, url, event));
  db.on("timeout", event => logger.info("[Mongo][timeout] Database: %s, Url: %s, Event: %j", dbName, url, event));
  db.on("parseError", event => logger.info("[Mongo][parseError] Database: %s, Url: %s, Event: %j", dbName, url, event));
  db.on("reconnect", event => logger.info("[Mongo][reconnect] Database: %s, Url: %s, Event: %j", dbName, url, event));
  db.once("fullsetup", event => logger.info("[Mongo][fullsetup] Database: %s, Url: %s, Event: %j", dbName, url, event));

  return db;
}

module.exports.isConnected = dbName => {
  const client = state.databases[dbName];
  return client && client.isConnected(dbName);
};

module.exports.ReadPreference = {
  PRIMARY: { readPreference: ReadPreference.PRIMARY }
};

module.exports.toObjectID = ids => {
  if (_.isEmpty(ids)) {
    return ids;
  }

  if (_.isArray(ids)) {
    return _.map(ids, id => new ObjectID(id));
  }

  return new ObjectID(ids);
};

module.exports.ObjectID = () => new ObjectID();

module.exports.simplifyObjectId = obj => {
  if (obj && obj._id) {
    obj._id = obj._id.toString();
  }
  return obj;
};

module.exports.wrapObjectId = obj => {
  if (obj && obj._id) {
    obj._id = module.exports.toObjectID(obj._id);
  }
  return obj;
};

module.exports.__ensureIndexes = () => {
  const promises = [];

  _.keys(databases).forEach(dbName => {
    const dbConf = databases[dbName];
    dbConf.models.forEach(modelConf => {
      if (!modelConf.hints) {
        return;
      }

      try {
        const hints = require("../" + modelConf.hints);
        _(hints)
          .mapValues((hint, key) => {
            if (!hint || key === "ID") {
              return;
            }

            const indexOptions = _.merge({ name: key, background: true }, hint.options);

            logger.info("[Mongo][createIndex] Creating index for collection: %s, index: %j, options: %j", modelConf.collection, hint, indexOptions);
            promises.push(module.exports[modelConf.name].createIndex(hint, indexOptions));
          })
          .value();
      } catch (e) {
        logger.error("[Mongo][ensureIndexes] Error - failed to find hints for collection - %s", modelConf.collection, e);
      }
    });
  });

  return Promise.all(promises);
};
