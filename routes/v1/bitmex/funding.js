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
 * /bitmex/funding/:pair:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/funding/:pair
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

router.post('/:pair', auth, async (req, res) => {
  const { uuid } = req.user;
  const { pair } = req.params;
  try {
    const funding = await BitmexService.selectFunding({
      uuid,
      pair,
      payload: req.body,
    });
    res.send(funding);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
