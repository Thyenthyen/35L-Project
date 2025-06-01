const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String, 
      required: true,
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
  });

module.exports = mongoose.model('Event', eventSchema);