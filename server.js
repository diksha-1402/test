const express = require('express');
const dotenv = require('dotenv');
const connectMainDB = require('./db/mainConnection');

dotenv.config();
const app = express();
app.use(express.json());

connectMainDB();

app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/subscribe', require('./routes/subscriptionRoutes'));
app.use('/api/tenant', require('./routes/tenantRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
