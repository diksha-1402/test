const express = require('express');
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const router = express.Router();

const getTenantDb = async (tenantId) => {
  const tenant = await Tenant.findById({ _id: new mongoose.Types.ObjectId(tenantId) });
  if (!tenant) throw new Error('Tenant not found');
  const uri = process.env.MONGO_URI.replace('mainDB', tenant.dbName);
  console.log(uri, "@=======uri")
  return mongoose.createConnection(uri);
};

router.get('/products/:userId', async (req, res) => {

  const tenantId = req.headers['x-tenant-id'];
  try {
    const conn = await getTenantDb(tenantId);
    const Product = conn.model('Product', new mongoose.Schema({ name: String, price: Number,userId: mongoose.Schema.Types.ObjectId, }), 'products');
    const products = await Product.find({ userId: new mongoose.Types.ObjectId(req.params.userId) });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'];
  const { name, price, userId } = req.body;
  console.log(req.body)
  try {
    const conn = await getTenantDb(tenantId);
     const Product = conn.model('Product', new mongoose.Schema({ name: String, price: Number ,userId: mongoose.Schema.Types.ObjectId,}), 'products');
    const newProduct = await Product.create({ name, price, userId});
    return res.json(newProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



module.exports = router;
