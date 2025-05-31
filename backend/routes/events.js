const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// POST a new event
router.post('/', async (req, res) => {
  const { title, date } = req.body;
  const newEvent = new Event({ title, date });
  const savedEvent = await newEvent.save();
  res.status(201).json(savedEvent);
});

module.exports = router;