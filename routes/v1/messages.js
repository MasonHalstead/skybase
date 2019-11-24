const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const MessageService = require('../../services/messages');

/**
 * @swagger
 * definitions:
 *   Message:
 *     properties:
 *       message:
 *         type: string
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /messages
 *     tags:
 *       - Messages
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Messages'
 */

router.post('/', auth, admin, async (req, res) => {
  const { uuid } = req.user;
  const { message } = req.body;
  try {
    const text = await MessageService.sendMessage({ uuid, message });
    res.status(200).send(text);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
