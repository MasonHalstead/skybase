const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const WalletModel = require('../../models/wallets');

/**
 * @swagger
 * definitions:
 *   Wallets:
 *     properties:
 *       id:
 *         type: number
 *       address:
 *         type: string
 *       name:
 *         type: string
 *       satoshi_balance:
 *         type: number
 */

/**
 * @swagger
 * /wallets:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /wallets
 *     tags:
 *       - Wallets
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            $ref: '#/definitions/Wallets'
 */

router.get('/', auth, admin, async (req, res) => {
  try {
    const wallets = await WalletModel.selectWallets();
    res.status(200).send(wallets);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /wallets/create:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /wallets/create
 *     tags:
 *       - Wallets
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              address:
 *                type: string
 *              name:
 *                type: string
 *            required:
 *              - address
 *              - name
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Wallets'
 */

router.post('/create', auth, admin, async (req, res) => {
  try {
    const wallet = await WalletModel.createWallet(req.body);
    res.status(200).send(wallet);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /wallets/${wallet_id}/balance:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /wallets/${wallet_id}/balance
 *     tags:
 *       - Wallets
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              satoshi_balance:
 *                type: number
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Wallets'
 */

router.post('/:wallet_id/balance', auth, admin, async (req, res) => {
  const { wallet_id } = req.params;
  const { satoshi_balance } = req.body;
  try {
    const wallet = await WalletModel.updateWalletBalance(
      wallet_id,
      satoshi_balance,
    );
    res.status(200).send(wallet);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
