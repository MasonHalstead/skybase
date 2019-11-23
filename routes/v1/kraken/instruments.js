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
 * /kraken/instruments/:instrument:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /kraken/instruments/:instrument
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

router.get('/:instrument', auth, async (req, res) => {
  const { instrument } = req.params;
  try {
    const instruments = await KrakenService.selectInstrument({
      instrument,
    });
    res.send(instruments);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
