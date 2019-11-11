const express = require('express');
const auth = require('../../../middleware/auth');
const BitmexService = require('../../../services/bitmex');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Bitmex:
 *     type: object
 */

/**
 * @swagger
 * /bitmex/wallet:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/wallet
 *     tags:
 *       - Bitmex
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          $ref: '#/definitions/Bitmex'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const wallet = await BitmexService.selectWallet(uuid);
    res.send(wallet);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/wallet/history:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/wallet/history
 *     tags:
 *       - Bitmex
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          $ref: '#/definitions/Bitmex'
 */

router.get('/history', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const wallet = await BitmexService.selectWalletHistory(uuid);
    res.send(wallet);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
