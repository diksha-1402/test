const express = require('express');
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const router = express.Router();

const getTenantDb = async (tenantId) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) throw new Error('Tenant not found');
  const uri = process.env.MONGO_URI.replace('mainDB', tenant.dbName);
  return mongoose.createConnection(uri);
};

router.get('/products', async (req, res) => {
  
  const tenantId = req.headers['x-tenant-id'];
  try {
    const conn = await getTenantDb(tenantId);
    const Product = conn.model('Product', new mongoose.Schema({ name: String, price: Number }), 'products');
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'];
  const { name, price } = req.body;
  try {
    const conn = await getTenantDb(tenantId);
    const Product = conn.model('Product', new mongoose.Schema({ name: String, price: Number }), 'products');
    const newProduct = await Product.create({ name, price });
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Another tenant-only function
router.get('/report', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'];
  try {
    const conn = await getTenantDb(tenantId);
    const Product = conn.model('Product', new mongoose.Schema({ name: String, price: Number }), 'products');
    const count = await Product.countDocuments();
    res.json({ totalProducts: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
