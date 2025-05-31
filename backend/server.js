const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/events', eventRoutes); 

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));