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
 * /kraken/wallet:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/wallet
 *     tags:
 *       - Kraken
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          $ref: '#/definitions/Kraken'
 */

router.get('/', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const wallet = await KrakenService.selectWallet(uuid);
    res.send(wallet);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
