const express = require('express');
const router = express.Router();
const docs = require('./docs');
const users = require('./users');
const wallets = require('./wallets');
const exchanges = require('./exchanges');
const intervals = require('./intervals');
const instruments = require('./instruments');
const order_types = require('./order_types');
const activity = require('./activity');
const status = require('./status');
const pairs = require('./pairs');

router.use('/docs', docs);
router.use('/users', users);
router.use('/wallets', wallets);
router.use('/exchanges', exchanges);
router.use('/intervals', intervals);
router.use('/order-types', order_types);
router.use('/instruments', instruments);
router.use('/activity', activity);
router.use('/status', status);
router.use('/pairs', pairs);

module.exports = router;
