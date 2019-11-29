const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const EquityModel = require('../../models/equity');

/**
 * @swagger
 * definitions:
 *   Equity:
 *     type: object
 *     properties:
 *      customer_id:
 *       type: string
 *      pair:
 *       type: string
 *      balance:
 *       type: number
 *      price_conversion:
 *       type: number
 *      date_time:
 *       type: date
 */

/**
 * @swagger
 * /equity/bitmex/:pair:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /equity/bitmex/:pair
 *     tags:
 *       - Equity
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
 *            $ref: '#/definitions/Equity'
 */

router.post('/bitmex/:pair', auth, async (req, res) => {
  const { pair } = req.params;
  const { uuid } = req.user;
  try {
    const equity = await EquityModel.selectUserEquity({
      uuid,
      pair,
      ...res.body,
    });
    res.status(200).send(equity);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /equity/:pair:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /equity/:pair
 *     tags:
 *       - Equity
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
 *            $ref: '#/definitions/Equity'
 */

router.post('/:pair', auth, async (req, res) => {
  const { pair } = req.params;
  const { uuid } = req.user;
  const { date_time, balance, price_conversion } = req.body;
  try {
    const equity = await EquityModel.createEquity({
      uuid,
      pair,
      balance,
      price_conversion,
      date_time,
    });
    res.status(200).send(equity);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
