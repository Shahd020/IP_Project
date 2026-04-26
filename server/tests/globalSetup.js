import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-do-not-use-in-prod';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-do-not-use-in-prod';
  process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  process.env.NODE_ENV = 'test';
  global.__MONGOD__ = mongod;
};
