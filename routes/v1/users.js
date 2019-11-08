const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const UserModel = require('../../models/users');
const UserService = require('../../services/users');

/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       uuid:
 *         type: string
 *         default: 5100bed0-e6e8-11e9-81b4-2a2ae2dbcce4
 *       admin:
 *         type: boolean
 *       email_address:
 *         type: string
 *       email_verification:
 *         type: boolean
 *       email_verified:
 *         type: boolean
 *       telephone:
 *         type: number
 *       telephone_verifiction:
 *         type: number
 *       telephone_verified:
 *         type: boolean
 *       text_messages:
 *         type: boolean
 *       display_name:
 *         type: string
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       wallet_address:
 *         type: string
 *       bitmex_key:
 *         type: boolean
 *       bitmex_secret:
 *         type: boolean
 *       binance_key:
 *         type: boolean
 *       binance_secret:
 *         type: boolean
 *       binance_us_key:
 *         type: boolean
 *       binance_us_secret:
 *         type: boolean
 *       kraken_key:
 *         type: boolean
 *       kraken_secret:
 *         type: boolean
 *       token:
 *         type: string
 *       created_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 *       updated_at:
 *         type: string
 *         default: 2019-10-10 00:00:00
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/me
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.get('/me', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const user = await UserModel.selectUser(uuid);
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: /users/login
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              email_address:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email_address
 *              - password
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.loginUser(req.body);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/register
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              email_address:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email_address
 *              - password
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.post('/register', async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/update
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              first_name:
 *                type: string
 *              last_name:
 *                type: string
 *              telephone:
 *                type: number
 *              wallet_address:
 *                type: string
 *              text_messages:
 *                type: boolean
 *              password:
 *                type: string
 *              bitmex_key:
 *                type: string
 *              bitmex_secret:
 *                type: string
 *              binance_key:
 *                type: string
 *              binance_secret:
 *                type: string
 *              binance_us_key:
 *                type: string
 *              binance_us_secret:
 *                type: string
 *              kraken_key:
 *                type: string
 *              kraken_secret:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.put('/update', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const user = await UserModel.updateUser(uuid, req.body);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/verify-email
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              email_verification:
 *                type: string
 *            required:
 *              - email_verification
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.post('/verify-email', async (req, res) => {
  const { email_verification } = req.body;
  try {
    const user = await UserModel.verifyUserEmail(email_verification);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/telephone:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/telephone
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              telephone:
 *                type: number
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.put('/telephone', auth, async (req, res) => {
  const { uuid } = req.user;
  const { telephone } = req.body;
  try {
    const user = await UserService.updateUserTelephone(uuid, telephone);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/verify-email
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              email_verification:
 *                type: string
 *            required:
 *              - email_verification
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.post('/verify-telephone', auth, async (req, res) => {
  const { uuid } = req.user;
  const { telephone_verification } = req.body;
  try {
    const user = await UserModel.verifyUserTelephone(
      uuid,
      telephone_verification,
    );
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/password:
 *   put:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/password
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.put('/password', auth, async (req, res) => {
  const { uuid } = req.user;
  try {
    const user = await UserModel.updateUserPassword(uuid, req.body);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: /users/forgot-password
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         key=value:
 *          schema:
 *            type: object
 *            properties:
 *              email_address:
 *                type: string
 *            required:
 *              - email_address
 *     responses:
 *       200:
 *         schema:
 *          $ref: '#/definitions/Users'
 */

router.post('/forgot-password', async (req, res) => {
  const { email_address } = req.body;
  try {
    const user = await UserService.forgotUserPassword(email_address);
    res.status(200).send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;
