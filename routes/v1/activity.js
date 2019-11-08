const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const ActivityModel = require('../../models/activity');

/**
 * @swagger
 * definitions:
 *   Activity:
 *     properties:
 *       id:
 *         type: number
 *       customer_id:
 *         type: number
 *       message:
 *         type: string
 *       reference_table:
 *         type: text
 *       reference_column:
 *         type: text
 *       reference_id:
 *         type: text
 *       date_time:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /activity:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /activity
 *     tags:
 *       - Activity
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Activity'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const activity = await ActivityModel.selectUserActivity(uuid);
    res.status(200).send(activity);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
