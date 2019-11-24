const express = require('express');
const auth = require('../../../middleware/auth');
const KrakenService = require('../../../services/kraken');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Kraken:
 *     type: object
 */

/**
 * @swagger
 * /kraken/candles/:pair:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/candles/:pair
 *     tags:
 *       - Kraken
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
 *              interval:
 *                type: string
 *                default: 1m
 *              start_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Kraken'
 */

router.post('/:pair', auth, async (req, res) => {
  const { uuid } = req.user;
  const { pair } = req.params;
  try {
    const candles = await KrakenService.selectCandles({
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
