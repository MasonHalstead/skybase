const express = require('express');
const router = express.Router();
const docs = require('./docs');
const users = require('./users');
const wallets = require('./wallets');

router.use('/docs', docs);
router.use('/users', users);
router.use('/wallets', wallets);

module.exports = router;
