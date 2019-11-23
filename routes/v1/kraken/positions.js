const express = require('express');
const auth = require('../../../middleware/auth');
const KrakenService = require('../../../services/kraken');
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
    const positions = await KrakenService.selectPositions(uuid);
    res.send(positions);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
