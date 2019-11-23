const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const InstrumentModel = require('../../models/instruments');

/**
 * @swagger
 * definitions:
 *   Instruments:
 *     properties:
 *       id:
 *         type: number
 *       instrument:
 *         type: string
 *         default: BTC
 *       name:
 *         type: string
 *         default: Bitcoin
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
 * /instruments:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /instruments
 *     tags:
 *       - Instruments
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Instruments'
 */

router.get('/', auth, async (req, res) => {
  try {
    const instruments = await InstrumentModel.selectInstruments();
    res.status(200).send(instruments);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
