const express = require('express');
const { createTenantDB } = require('../db/tenantManager');
const Tenant = require('../models/Tenant');
const router = express.Router();
const mongoose =require("mongoose")
// Simulate tenant subscription
router.post('/', async (req, res) => {
  const { email, tenantId } = req.body;
  try {
    let tenantData=await Tenant.findOne({_id:new mongoose.Types.ObjectId(tenantId)});
    if(!tenantData){
        return res.status(404).json({ error: 'Tenant not found' });
    }
    const dbName = await createTenantDB(email, tenantData.dbName);
    res.json({ message: `Tenant created with DB: ${tenantData.dbName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

module.exports = router;
