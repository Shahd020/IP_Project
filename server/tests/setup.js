// tests/setup.js — runs before each test file (setupFilesAfterFramework)
// globalSetup already started MongoMemoryServer and set process.env.MONGO_URI
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.connection.close();
});
