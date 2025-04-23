const express = require('express');
const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const router = express.Router();

// Public route: show sample products
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


router.post('/create-tenant', async (req, res) => {
    const users = await Tenant.findOne({email:req.body.email});
    if(users){
        return res.json({message: 'Email already exists'});
    }
    let tenantName=req.body.name;
    const dbName = `tenant_${tenantName.toLowerCase().replace(/\s+/g, '_')}`;
    const tenant = new Tenant({
        tenantName: req.body.name,
        email: req.body.email,
        dbName:dbName
    });

   await tenant.save();
   return res.json({message: 'Tenant created successfully'});
  });
  
  router.get('/login', async (req, res) => {
    const users = await Tenant.findOne({email:req.body.email});
    if(!users){
        return res.json({message: 'Email already exists'});
    }
   return res.json({message: 'tenant logged in successfully',data:users});
  });

module.exports = router;
