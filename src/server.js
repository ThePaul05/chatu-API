require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
connectDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
});
