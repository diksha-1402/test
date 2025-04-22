const { MongoClient } = require('mongodb');
const Tenant = require('../models/Tenant');
require('dotenv').config();

const createTenantDB = async (email, tenantDb) => {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

 
  const baseDb = client.db(process.env.BASE_TEMPLATE_DB);
  const newDb = client.db(tenantDb);

  const collections = await baseDb.listCollections().toArray();
  for (const coll of collections) {
    const docs = await baseDb.collection(coll.name).find().toArray();
    if (docs.length > 0) {
      await newDb.collection(coll.name).insertMany(docs);
    }
  }
  await client.close();
  return tenantDb;
};

module.exports = { createTenantDB };
