const express = require('express');
const auth = require('../../../middleware/auth');
const KrakenService = require('../../../services/kraken');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Kraken:
 *     type: object
 */

/**
 * @swagger
 * /kraken/pairs:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/pairs
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
  try {
    const pairs = await KrakenService.selectPairs();
    res.send(pairs);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /kraken/pairs/:pair:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/pairs/:pair
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

router.get('/:pair', auth, async (req, res) => {
  const { pair } = req.params;
  try {
    const pairs = await KrakenService.selectPair(pair);
    res.send(pairs);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
