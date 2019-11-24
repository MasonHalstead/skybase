const express = require('express');
const auth = require('../../../middleware/auth');
const router = express.Router();
const BitmexService = require('../../../services/bitmex');
/**
 * @swagger
 * definitions:
 *   Bitmex:
 *     type: object
 */

/**
 * @swagger
 * /bitmex/orders:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders
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
    const orders = await BitmexService.selectOrders(uuid);
    res.send(orders);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/orders/:order_id:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders/:order_id
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

router.get('/:order_id', auth, async (req, res) => {
  const { uuid } = req.user;
  const { order_id } = req.params;
  try {
    const orders = await BitmexService.selectOrder({ uuid, order_id });
    res.send(orders);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/orders/limit:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders/limit
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
 *              qty:
 *                type: number
 *              price:
 *                type: number
 *              execution_instructions:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 *            bitmex:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 */

router.post('/limit', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await BitmexService.createLimitOrders({
      uuid,
      payload: req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/orders/market:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders/market
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
 *              qty:
 *                type: number
 *              execution_instructions:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 *            bitmex:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 */

router.post('/market', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await BitmexService.createMarketOrders({
      uuid,
      payload: req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/orders/stop:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders/stop
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
 *              qty:
 *                type: number
 *              side:
 *                type: string
 *              stop_px:
 *                type: number
 *              execution_instructions:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 *            bitmex:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 */

router.post('/stop', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await BitmexService.createStopOrders({
      uuid,
      payload: req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /bitmex/stop-limit:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/orders/stop-limit
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
 *              qty:
 *                type: number
 *              side:
 *                type: string
 *              price:
 *                type: number
 *              stop_px:
 *                type: number
 *              execution_instructions:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            skydax:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 *            bitmex:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/definitions/Bitmex'
 */

router.post('/stop-limit', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const order = await BitmexService.createStopLimitOrders({
      uuid,
      payload: req.body,
    });
    res.send(order);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
