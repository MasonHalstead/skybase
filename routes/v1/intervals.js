const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const IntervalModel = require('../../models/intervals');

/**
 * @swagger
 * definitions:
 *   Interval:
 *     properties:
 *       id:
 *         type: number
 *       interval:
 *         type: string
 *         default: M1
 *       name:
 *         type: string
 *         default: 1 minute
 *       seconds:
 *         type: number
 *         default: 60
 *       created_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 *       updated_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /intervals:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /intervals
 *     tags:
 *       - Intervals
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Interval'
 */

router.get('/', auth, async (req, res) => {
  try {
    const intervals = await IntervalModel.selectIntervals();
    res.status(200).send(intervals);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
