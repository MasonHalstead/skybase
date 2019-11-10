const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const StrategyModel = require('../../models/strategies');

/**
 * @swagger
 * definitions:
 *   Strategies:
 *     properties:
 *       id:
 *         type: number
 *       customer_id:
 *         type: number
 *       exchange_id:
 *         type: number
 *       satoshi_fees:
 *         type: number
 *       satoshi_entry:
 *         type: number
 *       satoshi_current:
 *         type: number
 *       satoshi_unrealised:
 *         type: number
 *       portfolio_balance:
 *         type: number
 *       status_id:
 *         type: number
 *       pair_id:
 *         type: number
 *       fee_reference:
 *         type: string
 *       fee_status:
 *         type: string
 *       container_image:
 *         type: string
 *       reconciled_time:
 *         type: date
 *       created_at:
 *         type: date
 */

/**
 * @swagger
 * /strategies:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /strategies
 *     tags:
 *       - Strategies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Strategies'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const strategies = await StrategyModel.selectUserStrategies(uuid);
    res.send(strategies);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
