const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

const migrateCollection = async (sourceDb, targetDb, collectionName, userId) => {
  const matchQuery = collectionName === 'users'
    ? { _id: new mongoose.Types.ObjectId(userId) }
    : { userId: new mongoose.Types.ObjectId(userId) };

  try {
    await sourceDb.collection(collectionName).aggregate([
      { $match: matchQuery },
      { $out: { db: targetDb, coll: collectionName } }
    ]).toArray();

    console.log(`Migrated: ${collectionName}`);
  } catch (err) {
    console.warn(`Skipped ${collectionName}:`, err.message);
  }
};

const dumpAndRestoreUserData = async (userId, username, options = {}) => {
  const targetDb = `${username}_${userId}`;
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const sourceDb = client.db('mainDB');
    const collections = await sourceDb.listCollections().toArray();

    const filtered = collections.filter(c => c.name !== 'tenants');

    console.log(`Starting migration to: ${targetDb}`);

    // Parallelize migrations
    await Promise.all(
      filtered.map(col => migrateCollection(sourceDb, targetDb, col.name, userId))
    );

    // Save tenant record
    const tenantInfo = {
      userId: userId,
      dbName: targetDb,
    };

    await sourceDb.collection('tenants').insertOne(tenantInfo);
    console.log(`Tenant info saved to mainDB.tenants:`, tenantInfo);

  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.close();
    console.log(`Migration to ${targetDb} completed.`);
  }
};

module.exports = dumpAndRestoreUserData;
