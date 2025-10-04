const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ganga';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true
  });
  console.log('Connected to MongoDB');
}

module.exports = { connectMongo };

