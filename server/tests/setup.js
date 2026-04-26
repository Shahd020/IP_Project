const mongoose = require('mongoose');

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ─── Connect before tests ─────────────────────────
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// ─── Clean DB after each test ─────────────────────
afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

// ─── Close connection after all tests ─────────────
afterAll(async () => {
  await mongoose.connection.close();
});