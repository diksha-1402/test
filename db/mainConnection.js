const mongoose = require('mongoose');

const connectMainDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Main DB');
  } catch (err) {
    console.error('Main DB connection error:', err);
  }
};

module.exports = connectMainDB;
