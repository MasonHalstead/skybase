const express = require('express');
const auth = require('../../../middleware/auth');
const BitmexService = require('../../../services/bitmex');
const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Bitmex:
 *     type: object
 */

/**
 * @swagger
 * /bitmex/instruments/:instrument:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/instruments/:instrument
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

router.get('/:instrument', auth, async (req, res) => {
  const { uuid } = req.user;
  const { instrument } = req.params;
  try {
    const instruments = await BitmexService.selectInstrument({
      uuid,
      instrument,
    });
    res.send(instruments);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
