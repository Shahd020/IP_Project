// tests/globalTeardown.js — runs once after ALL test suites
module.exports = async () => {
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
};
