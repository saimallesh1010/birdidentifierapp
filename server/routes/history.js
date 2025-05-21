const express = require('express');
const router = express.Router();
const Prediction = require('../models/prediction');

router.get('/:userId', async (req, res) => {
  const history = await Prediction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;
