const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events for logged in user
router.get('/', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const events = await Event.find({userId});
  res.json(events);
});

// POST a new event
router.post('/', async (req, res) => { 
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  const { title, date } = req.body;
  const newEvent = new Event({ title, date, userId });
  const savedEvent = await newEvent.save();
  res.status(201).json(savedEvent);
});

module.exports = router;