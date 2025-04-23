const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dbName: { type: String, required: true },
});

module.exports = mongoose.model('Tenant', tenantSchema);
