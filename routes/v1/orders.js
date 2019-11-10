const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const OrderModel = require('../../models/orders');

/**
 * @swagger
 * definitions:
 *   Orders:
 *     properties:
 *       id:
 *         type: number
 *       customer_id:
 *         type: string
 *       exchange_id:
 *         type: number
 *       exchange_account_id:
 *         type: number
 *       pair_id:
 *         type: number
 *       order_type_id:
 *         type: string
 *       side:
 *         type: string
 *       price:
 *         type: number
 *       status_id:
 *         type: number
 *       date_time:
 *         type: date
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /orders
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Orders'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const orders = await OrderModel.selectUserOrder(uuid);
    res.send(orders);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
