const express = require('express');
const dumpAndRestoreUserData  = require('../db/tenantManager');
const Tenant = require('../models/Tenant');
const router = express.Router();
const User=require('../models/User');
const mongoose =require("mongoose")
// Simulate tenant subscription
router.post('/', async (req, res) => {
  const { userId } = req.body;
  try {
    let tenantData=await User.findOne({_id:new mongoose.Types.ObjectId(userId)});
    if(!tenantData){
        return res.status(404).json({ error: 'User not found' });
    }
    const dbName = await dumpAndRestoreUserData(userId,tenantData.name);
    return res.json({ message: 'Subscription Success' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Subscription failed' });
  }
});

module.exports = router;
