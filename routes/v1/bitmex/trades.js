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
 * /bitmex/trades/:pair:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/trades/:pair
 *     tags:
 *       - Bitmex
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
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Bitmex'
 */

router.get('/:pair', auth, async (req, res) => {
  const { uuid } = req.user;
  const { pair } = req.params;
  try {
    const price = await BitmexService.selectTrades({
      uuid,
      pair,
      payload: req.body,
    });
    res.send(price);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
