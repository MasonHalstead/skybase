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
 * /bitmex/positions:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/positions
 *     tags:
 *       - Bitmex
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Bitmex'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const positions = await BitmexService.selectPositions(uuid);
    res.send(positions);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/positions/:pair:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/positions/:pair
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

router.get('/:pair', auth, async (req, res) => {
  const { uuid } = req.user;
  const { pair } = req.params;
  try {
    const positions = await BitmexService.selectPosition({
      uuid,
      pair,
    });
    res.send(positions);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/positions/leverage:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/positions/leverage
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
 *              symbol:
 *                type: string
 *              leverage:
 *                type: number
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          $ref: '#/definitions/Bitmex'
 */

router.post('/leverage', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const leverage = await BitmexService.updateLeverage({
      uuid,
      payload: req.body,
    });
    res.send(leverage);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
