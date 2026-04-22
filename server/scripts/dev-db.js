/**
 * dev-db.js — starts a persistent local MongoDB instance for development.
 *
 * Uses mongodb-memory-server to download the real mongod binary (one-time, ~250 MB).
 * Data is stored in server/data/db and survives restarts, so your seeded
 * data stays between server restarts.
 *
 * Usage:
 *   node scripts/dev-db.js          (keep terminal open)
 *   OR: npm run db                  (shortcut)
 *
 * The dev server (npm run dev) reads MONGO_URI from .env which points here.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db');
const PORT = 27017;

async function main() {
  console.log('Starting local MongoDB...');
  console.log('Data directory:', DB_PATH);

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: PORT,
      dbPath: DB_PATH,
      storageEngine: 'wiredTiger',
    },
  });

  const uri = mongod.getUri();
  console.log('\n✓ MongoDB is running!');
  console.log(`  URI: ${uri}`);
  console.log(`  Port: ${PORT}`);
  console.log('\nPress Ctrl+C to stop.\n');

  // Keep the process alive so mongod stays running
  process.on('SIGINT', async () => {
    console.log('\nStopping MongoDB...');
    await mongod.stop({ doCleanup: false }); // doCleanup:false preserves data
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Failed to start MongoDB:', err);
  process.exit(1);
});
