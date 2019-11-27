const express = require('express');
const router = express.Router();
const candles = require('./candles');
const wallet = require('./wallet');
const positions = require('./positions');
const orders = require('./orders');
const pairs = require('./pairs');
const instruments = require('./instruments');

router.use('/candles', candles);
router.use('/wallet', wallet);
router.use('/pairs', pairs);
router.use('/orders', orders);
router.use('/positions', positions);
router.use('/instruments', instruments);

module.exports = router;
