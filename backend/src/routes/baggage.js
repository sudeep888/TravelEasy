// backend/src/routes/baggage.js
const express = require('express');
const router = express.Router();
const { 
  calculateBaggage,
  getAirlineBaggageRules 
} = require('../controllers/baggageController');
const { validateBaggageCalculation } = require('../validators/baggageValidator');

/**
 * @route POST /api/baggage/calculate
 * @desc Calculate baggage allowance and excess fees
 * @access Public
 */
router.post('/calculate', validateBaggageCalculation, calculateBaggage);

/**
 * @route GET /api/baggage/rules/:airlineCode
 * @desc Get baggage rules for a specific airline
 * @access Public
 */
router.get('/rules/:airlineCode', getAirlineBaggageRules);

module.exports = router;