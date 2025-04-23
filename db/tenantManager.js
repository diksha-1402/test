const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')


const dumpAndRestoreUserData = async (userId, username) => {
  // Cleanup old dump dir if exists
  const uri = 'mongodb://localhost:27017';
  console.log(userId, "------userId")

  const targetDb = `${username}_${userId}`;

  const client = new MongoClient(uri);
  await client.connect();

  const sourceDb = client.db('mainDB');
  const collections = await sourceDb.listCollections().toArray();

  for (const { name: collectionName } of collections) {
    if (collectionName === 'tenants') {
      console.log(`Skipping collection: ${collectionName}`);
      continue;
    }
    const matchQuery = collectionName === 'users'
      ? { _id: new mongoose.Types.ObjectId(userId) }
      : { userId: new mongoose.Types.ObjectId(userId) };
    try {
      await sourceDb.collection(collectionName).aggregate([
        { $match: matchQuery },
        { $out: { db: targetDb, coll: collectionName } }
      ]).toArray();
      console.log(`Migrated collection: ${collectionName}`);
    } catch (err) {
      console.warn(`Skipped ${collectionName}:`, err.message);
    }
  }

  try {
    const tenantInfo = {
      userId: userId,
      dbName: targetDb,
    };

    await sourceDb.collection('tenants').insertOne(tenantInfo);
    console.log(`Tenant info saved to mainDB.tenants:`, tenantInfo);
  } catch (err) {
    console.error('Failed to store tenant info:', err.message);
  }

  await client.close();
  console.log(`Migration to ${targetDb} completed.`);
}

module.exports = dumpAndRestoreUserData;