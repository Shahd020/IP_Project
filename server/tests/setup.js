/**
 * Jest global setup — runs once per test file via setupFilesAfterFramework.
 *
 * Uses mongodb-memory-server to spin up a real (but ephemeral) MongoDB process
 * in memory.  This gives us accurate index and validation behaviour without
 * touching any real database.
 *
 * Install the extra dev dependency before running tests:
 *   npm install -D mongodb-memory-server
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

// ─── Start in-memory MongoDB before the test file's first test ───────────────
beforeAll(async () => {
  // Silence Mongoose connection logs during tests
  mongoose.set('strictQuery', false);

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, { maxPoolSize: 5 });
});

// ─── Wipe every collection between individual tests ──────────────────────────
// This guarantees test isolation: state from test A never leaks into test B.
afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((col) => col.deleteMany({}))
  );
});

// ─── Tear down after all tests in this file ──────────────────────────────────
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});
