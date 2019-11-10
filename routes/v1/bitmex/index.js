const express = require('express');
const router = express.Router();
const orders = require('./orders');
const status = require('./status');
const price = require('./price');
const candles = require('./candles');
const funding = require('./funding');
const wallet = require('./wallet');
const composites = require('./composites');
const instruments = require('./instruments');
const positions = require('./positions');

router.use('/orders', orders);
router.use('/status', status);
router.use('/price', price);
router.use('/wallet', wallet);
router.use('/instruments', instruments);
router.use('/candles', candles);
router.use('/composites', composites);
router.use('/funding', funding);
router.use('/positions', positions);

module.exports = router;
