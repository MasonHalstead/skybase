const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const OrderTypesModel = require('../../models/order_types');

/**
 * @swagger
 * definitions:
 *   OrderTypes:
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         default: Market Order
 *       query_name:
 *         type: string
 *         default: MarketOrder
 *       on_binance:
 *         type: boolean
 *       on_binance_us:
 *         type: boolean
 *       on_bitmex:
 *         type: boolean
 *       on_kraken:
 *         type: boolean
 *       created_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 *       updated_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /order-types:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /order-types
 *     tags:
 *       - Order Types
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/OrderTypes'
 */

router.get('/', auth, async (req, res) => {
  try {
    const order_types = await OrderTypesModel.selectOrderTypes();
    res.status(200).send(order_types);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
