const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  email: { type: String, required: true },
  tenantName: { type: String, required: true },
  dbName: { type: String, required: true },
});

module.exports = mongoose.model('Tenant', tenantSchema);
