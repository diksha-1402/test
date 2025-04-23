const express = require('express');
const Product = require('../models/Product');
const Tenant = require('../models/Tenant');
const router = express.Router();
const User=require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose =require('mongoose');

// Public route: show sample products
router.get('/products/:userId', async (req, res) => {
  const products = await Product.find({userId:new mongoose.Types.ObjectId(req.params.userId)});
  res.json(products);
});

router.post('/products', async (req, res) => {
 
  const { name, price,userId } = req.body;
  try {
    const newProduct = await Product.create({ name, price ,userId:userId});
    return res.json(newProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/signup', async (req, res) => {
  let name=req.body.name;
 
    const users = await User.findOne({email:req.body.email});
    if(users){
        return res.json({message: 'Email already exists'});
    }
   
    const dbName = `tenant_${name.toLowerCase().replace(/\s+/g, '_')}`;
    const user = new User({
        name: name,
        email: req.body.email,
        dbName:dbName
    });

   await user.save();
   return res.json({message: 'User created successfully'});
  });
  
  router.get('/login', async (req, res) => {
    const users = await User.findOne({email:req.body.email});
    if(!users){
        return res.json({message: 'User not found'});
    }
     // Create JWT token
     const token = jwt.sign(
      { _id: users._id, email: users.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
   return res.json({message: 'User logged in successfully',data:users,token:token});
  });

module.exports = router;
