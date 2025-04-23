const { MongoClient } = require('mongodb');
const Tenant = require('../models/Tenant');
require('dotenv').config();
const { exec } = require('child_process');

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
  const todb = process.env.MONGO_URI.replace('mainDB', tenantDb);
  console.log("todb--------",todb)
  await cloneDB(process.env.MONGO_URI,todb)
  await client.close();
  return tenantDb;
};

const cloneDB = async(fromDb, toDb) => {
  const dumpCmd = `mongodump --uri="${process.env.MONGO_URI}" --db=${fromDb} --out=./dump`;
  const restoreCmd = `mongorestore --uri="${process.env.MONGO_URI}" --nsFrom="${fromDb}.*" --nsTo="${toDb}.*" ./dump/${fromDb}`;

  exec(`${dumpCmd} && ${restoreCmd}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error cloning DB: ${err.message}`);
    } else {
      console.log('Database cloned successfully.');
    }
  });
};

module.exports = { createTenantDB };
