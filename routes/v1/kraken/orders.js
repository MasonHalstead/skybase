const express = require('express');
const auth = require('../../../middleware/auth');
const router = express.Router();
const KrakenService = require('../../../services/kraken');
/**
 * @swagger
 * definitions:
 *   Kraken:
 *     type: object
 */

/**
 * @swagger
 * /kraken/orders:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/orders
 *     tags:
 *       - Kraken
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Kraken'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const orders = await KrakenService.selectOrders(uuid);
    res.send(orders);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /kraken/orders/limit:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/orders/limit
 *     tags:
 *       - Kraken
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              price:
 *                type: number
 *              trigger_price:
 *                type: number
 *              volume:
 *                type: number
 *              leverage:
 *                type: number
 *              start_date:
 *                type: date
 *              expires_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 *            kraken:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 */

router.post('/limit', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await KrakenService.createOrders({
      uuid,
      order_type: 'limit',
      ...req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /kraken/market/limit:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/market/limit
 *     tags:
 *       - Kraken
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              price:
 *                type: number
 *              trigger_price:
 *                type: number
 *              volume:
 *                type: number
 *              leverage:
 *                type: number
 *              start_date:
 *                type: date
 *              expires_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 *            kraken:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 */

router.post('/market', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await KrakenService.createOrders({
      uuid,
      order_type: 'market',
      ...req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /kraken/market/stop-loss:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/market/stop-loss
 *     tags:
 *       - Kraken
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *              price:
 *                type: number
 *              trigger_price:
 *                type: number
 *              volume:
 *                type: number
 *              leverage:
 *                type: number
 *              start_date:
 *                type: date
 *              expires_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 *            kraken:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Kraken'
 */

router.post('/stop-loss', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await KrakenService.createOrders({
      uuid,
      order_type: 'stop-loss',
      ...req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
