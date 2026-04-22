// tests/globalSetup.js — runs once before ALL test suites
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-do-not-use-in-prod';
  process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-do-not-use-in-prod';
  process.env.ACCESS_TOKEN_EXPIRES_IN = '15m';
  process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
  process.env.NODE_ENV = 'test';
  global.__MONGOD__ = mongod;
};
