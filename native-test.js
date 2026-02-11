import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

try {
  await client.connect();
  await client.db().command({ ping: 1 });
  console.log('native driver connected (ping ok)');
} catch (err) {
  console.error('native driver failed (full):');
  console.error(err);
} finally {
  await client.close().catch(() => {});
}
