const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CandleModel = require('../../models/candles');

/**
 * @swagger
 * definitions:
 *   Candle:
 *     type: object
 *     properties:
 *      pair:
 *       type: string
 *      open:
 *       type: number
 *      high:
 *       type: number
 *      low:
 *       type: number
 *      close:
 *       type: number
 *      volume:
 *       type: number
 *      date_time:
 *       type: date
 */

/**
 * @swagger
 * /candles/:exchange/:pair/:interval:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /candles/:exchange/:pair/:interval
 *     tags:
 *       - Candles
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              start_date:
 *                type: date
 *              end_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Candle'
 */

router.get('/:exchange/:pair/:interval', auth, async (req, res) => {
  const { exchange, pair, interval } = req.params;
  const { start_date, end_date, count } = req.body;
  try {
    const candles = await CandleModel.selectCandles({
      exchange,
      interval,
      count,
      pair,
      start_date,
      end_date,
    });
    res.status(200).send(candles);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
