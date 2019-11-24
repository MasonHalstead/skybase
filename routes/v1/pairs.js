const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const PairModel = require('../../models/pairs');

/**
 * @swagger
 * definitions:
 *   Pair:
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         default: BTC_USD
 *       short_name:
 *         type: string
 *         default: BTC/USD
 *       combined_name:
 *         type: string
 *         default: BTCUSD
 *       base:
 *         type: string
 *         default: BTC
 *       quote:
 *         type: string
 *         default: USD
 *       on_binance:
 *         type: boolean
 *       on_binance_us:
 *         type: boolean
 *       on_bitmex:
 *         type: boolean
 *       on_kraken:
 *         type: boolean
 *       created_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 *       updated_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /pairs:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /pairs
 *     tags:
 *       - Pairs
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Pair'
 */

router.get('/', auth, async (req, res) => {
  try {
    const pairs = await PairModel.selectPairs();
    res.status(200).send(pairs);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
