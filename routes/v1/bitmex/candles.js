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
 * /bitmex/candles/:pair:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/candles/:pair
 *     tags:
 *       - Bitmex
 *     parameters:
 *      - in: path
 *        name: pair
 *        schema:
 *          type: string
 *          required: true
 *          description: String name of pair
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              count:
 *                type: number
 *                default: 1000
 *              interval:
 *                type: string
 *                default: 1m
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
 *            $ref: '#/definitions/Bitmex'
 */

router.post('/:pair', auth, async (req, res) => {
  const { uuid } = req.user;
  const { pair } = req.params;
  try {
    const candles = await BitmexService.selectCandles({
      uuid,
      pair,
      ...req.body,
    });
    res.send(candles);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
