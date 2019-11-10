const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const ManagedStrategyModel = require('../../models/managed_strategies');

/**
 * @swagger
 * definitions:
 *   ManagedStrategies:
 *     properties:
 *       id:
 *         type: number
 *       customer_id:
 *         type: number
 *       exchange_id:
 *         type: number
 *       satoshi_fees:
 *         type: number
 *       satoshi_deposit:
 *         type: number
 *       satoshi_deposited:
 *         type: number
 *       satoshi_entry:
 *         type: number
 *       satoshi_withdraw:
 *         type: number
 *       satoshi_balance:
 *         type: number
 *       fund_id:
 *         type: number
 *       status_id:
 *         type: number
 *       deposit_reference:
 *         type: string
 *       deposit_status:
 *         type: string
 *       withdraw_reference:
 *         type: string
 *       withdraw_status:
 *         type: string
 *       reconciled_time:
 *         type: date
 *       created_at:
 *         type: date
 */

/**
 * @swagger
 * /managed-strategies:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /managed-strategies
 *     tags:
 *       - Managed Strategies
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/ManagedStrategies'
 */

router.get('/', auth, async (req, res) => {
  try {
    const strategies = await ManagedStrategyModel.selectStrategies();
    res.send(strategies);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
