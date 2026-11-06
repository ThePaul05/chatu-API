const mongoose = require('mongoose');
module.exports = async function connectDB() {
  try {
    if (!process.env.MONGO_URI) throw new Error('Falta MONGO_URI en .env');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err.message);
    process.exit(1);
  }
};
