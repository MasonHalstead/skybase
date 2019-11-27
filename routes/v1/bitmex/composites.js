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
 * /bitmex/composites/:instrument:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /bitmex/composites/:instrument
 *     tags:
 *       - Bitmex
 *     parameters:
 *      - in: path
 *        name: instrument
 *        schema:
 *          type: string
 *          required: true
 *          description: String name of instrument
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              count:
 *                type: number
 *                default: 500
 *              start_date:
 *                type: date
 *              end_date:
 *                type: date
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Bitmex'
 */

router.post('/:instrument', auth, async (req, res) => {
  const { uuid } = req.user;
  const { instrument } = req.params;
  try {
    const composites = await BitmexService.selectComposites({
      uuid,
      instrument,
      ...req.body,
    });
    res.send(composites);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
