const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

app.use(session({
  secret: 'test',  
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }    
}));

app.use(express.json());
app.use(cors());
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));