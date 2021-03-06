const express = require('express');
const router = express.Router();
const candles = require('./candles');
const funding = require('./funding');
const instruments = require('./instruments');
const trades = require('./trades');
const positions = require('./positions');
const orders = require('./orders');
const composites = require('./composites');
const wallet = require('./wallet');

router.use('/orders', orders);
router.use('/composites', composites);
router.use('/candles', candles);
router.use('/funding', funding);
router.use('/instruments', instruments);
router.use('/positions', positions);
router.use('/trades', trades);
router.use('/wallet', wallet);

module.exports = router;
