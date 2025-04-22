const mongoose = require('mongoose');
const Tenant = require('./Tenant');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  TenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
});

module.exports = mongoose.model('Product', productSchema);
