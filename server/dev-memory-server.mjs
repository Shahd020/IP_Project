const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create();

  process.env.NODE_ENV = 'development';
  process.env.PORT = process.env.PORT || '5000';
  process.env.MONGODB_URI = mongod.getUri('eduplatform');
  process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'local-dev-access-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'local-dev-refresh-secret';
  process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  console.log(`Temporary MongoDB running at ${process.env.MONGODB_URI}`);

  require('./src/server.js');
})();