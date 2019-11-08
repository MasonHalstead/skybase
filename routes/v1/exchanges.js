const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const ExchangeModel = require('../../models/exchanges');

/**
 * @swagger
 * definitions:
 *   Exchanges:
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         default: Kraken
 *       created_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 *       updated_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /exchanges:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /exchanges
 *     tags:
 *       - Exchanges
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Exchanges'
 */

router.get('/', auth, async (req, res) => {
  try {
    const exchanges = await ExchangeModel.selectExchanges();
    res.status(200).send(exchanges);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
