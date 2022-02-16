const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Sparkle = require('../models/Sparkle');

module.exports = Router()
  .post('/', authenticate, async (req, res) => {
    const sparkle = await Sparkle.insert({
      text: req.body.text,
      userId: req.user.id,
    });
    res.json(sparkle);
  })
  .get('/', authenticate, async (req, res) => {
    const sparkles = await Sparkle.getAll();
    res.json(sparkles);
  });
