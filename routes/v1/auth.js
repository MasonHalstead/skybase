const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const UserModel = require('../../models/users');
const AuthService = require('../../services/auth');
/**
 * @swagger
 * definitions:
 *   Auth:
 *     properties:
 *       token:
 *         type: string
 */

/**
 * @swagger
 * /auth/token:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /auth/token
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Auth'
 */

router.get('/token', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const user = await UserModel.selectUser(uuid);
    res.send(user.token);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

router.get('/bitmex', auth, async (req, res) => {
  try {
    const token = await AuthService.verifyBitmex(req.user);
    res.send(token);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
