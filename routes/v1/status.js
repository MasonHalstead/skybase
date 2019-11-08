const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const StatusModel = require('../../models/status');

/**
 * @swagger
 * definitions:
 *   Status:
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *         default: Pending
 */

/**
 * @swagger
 * /status:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /status
 *     tags:
 *       - Status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Status'
 */

router.get('/', auth, async (req, res) => {
  try {
    const status = await StatusModel.selectStatus();
    res.status(200).send(status);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
