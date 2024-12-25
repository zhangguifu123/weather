const express = require('express');
const router = express.Router();
const historyModel = require('../models/historyModel');

router.get('/', async (req, res) => {
  try {
    // Load full history
    const allRecords = await historyModel.loadHistory();
    // Just return the top 5 or all
    const recent = allRecords.slice(-5).reverse(); // last 5 in reverse order
    return res.json(recent);
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({ error: 'Failed to load history' });
  }
});

module.exports = router;
