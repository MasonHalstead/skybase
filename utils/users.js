const bcrypt = require('bcryptjs');
const numbers = require('random-number');
const letters = require('random-letters');
const uuid = require('uuid');
const tokens = require('../utils/tokens');
const crypto = require('../utils/crypto');

const createPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const createRandomPassword = () => letters(16);

const createUser = async user => {
  if (user.password) {
    password = await createPassword(user.password);
  }
  return [
    user.email_address,
    user.first_name,
    user.last_name,
    letters(16),
    numbers({
      min: 10000000,
      max: 99999999,
      integer: true,
    }),
    password,
    uuid.v1(),
  ];
};

const encryptUser = async (uuid, user) => {
  const updated_at = new Date();

  let password = null;
  let bitmex_key = null;
  let bitmex_secret = null;
  let binance_key = null;
  let binance_secret = null;
  let binance_us_key = null;
  let binance_us_secret = null;
  let kraken_key = null;
  let kraken_secret = null;
  let oanda_key = null;
  let oanda_secret = null;

  if (user.password) {
    password = await createPassword(user.password);
  }
  if (user.bitmex_key) {
    bitmex_key = await crypto.encrypt(user.bitmex_key);
  }
  if (user.bitmex_secret) {
    bitmex_secret = await crypto.encrypt(user.bitmex_secret);
  }
  if (user.binance_key) {
    binance_key = await crypto.encrypt(user.binance_key);
  }
  if (user.binance_secret) {
    binance_secret = await crypto.encrypt(user.binance_secret);
  }
  if (user.binance_us_key) {
    binance_us_key = await crypto.encrypt(user.binance_us_key);
  }
  if (user.binance_us_secret) {
    binance_us_secret = await crypto.encrypt(user.binance_us_secret);
  }
  if (user.kraken_key) {
    kraken_key = await crypto.encrypt(user.kraken_key);
  }
  if (user.kraken_secret) {
    kraken_secret = await crypto.encrypt(user.kraken_secret);
  }
  if (user.oanda_key) {
    oanda_key = await crypto.encrypt(user.oanda_key);
  }
  if (user.oanda_secret) {
    oanda_secret = await crypto.encrypt(user.oanda_secret);
  }

  return [
    uuid,
    user.first_name || null,
    user.last_name || null,
    user.telephone || null,
    user.wallet_address || null,
    user.text_messages || null,
    password,
    bitmex_key,
    bitmex_secret,
    binance_key,
    binance_secret,
    binance_us_key,
    binance_us_secret,
    kraken_key,
    kraken_secret,
    oanda_key,
    oanda_secret,
    updated_at,
  ];
};

const privateUser = async user => {
  let bitmex_key = false;
  let bitmex_secret = false;
  let binance_key = false;
  let binance_secret = false;
  let binance_us_key = false;
  let binance_us_secret = false;
  let kraken_key = false;
  let kraken_secret = false;
  let oanda_key = false;
  let oanda_secret = false;

  if (user.bitmex_key) {
    bitmex_key = true;
  }
  if (user.bitmex_secret) {
    bitmex_secret = true;
  }
  if (user.binance_key) {
    binance_key = true;
  }
  if (user.binance_secret) {
    binance_secret = true;
  }
  if (user.binance_us_key) {
    binance_us_key = true;
  }
  if (user.binance_us_secret) {
    binance_us_secret = true;
  }
  if (user.kraken_key) {
    kraken_key = true;
  }
  if (user.kraken_secret) {
    kraken_secret = true;
  }
  if (user.oanda_key) {
    oanda_key = true;
  }
  if (user.oanda_secret) {
    oanda_secret = true;
  }
  return {
    uuid: user.uuid,
    admin: user.admin,
    email_address: user.email_address,
    email_verified: user.email_verified,
    telephone: user.telephone,
    telephone_verified: user.telephone_verified,
    first_name: user.first_name,
    last_name: user.last_name,
    wallet_address: user.wallet_address,
    text_messages: user.text_messages,
    bitmex_key,
    bitmex_secret,
    binance_key,
    binance_secret,
    binance_us_key,
    binance_us_secret,
    kraken_key,
    kraken_secret,
    oanda_key,
    oanda_secret,
    token: tokens.createToken(user),
  };
};
const publicUser = async user => {
  let bitmex_key = null;
  let bitmex_secret = null;
  let binance_key = null;
  let binance_secret = null;
  let binance_us_key = null;
  let binance_us_secret = null;
  let kraken_key = null;
  let kraken_secret = null;
  let oanda_key = null;
  let oanda_secret = null;

  if (user.bitmex_key) {
    bitmex_key = crypto.decrypt(user.bitmex_key);
  }
  if (user.bitmex_secret) {
    bitmex_secret = crypto.decrypt(user.bitmex_secret);
  }
  if (user.binance_key) {
    binance_key = crypto.decrypt(user.binance_key);
  }
  if (user.binance_secret) {
    binance_secret = crypto.decrypt(user.binance_secret);
  }
  if (user.binance_us_key) {
    binance_us_key = crypto.decrypt(user.binance_us_key);
  }
  if (user.binance_us_secret) {
    binance_us_secret = crypto.decrypt(user.binance_us_secret);
  }
  if (user.kraken_key) {
    kraken_key = crypto.decrypt(user.kraken_key);
  }
  if (user.kraken_secret) {
    kraken_secret = crypto.decrypt(user.kraken_secret);
  }
  if (user.oanda_key) {
    oanda_key = crypto.decrypt(user.oanda_key);
  }
  if (user.oanda_secret) {
    oanda_secret = crypto.decrypt(user.oanda_secret);
  }
  return {
    uuid: user.uuid,
    email_address: user.email_address,
    email_verified: user.email_verified,
    email_verification: user.email_verification,
    first_name: user.first_name,
    last_name: user.last_name,
    telephone: user.telephone,
    telephone_verified: user.telephone_verified,
    telephone_verification: user.telephone_verification,
    wallet_address: user.wallet_address,
    text_messages: user.text_messages,
    bitmex_key,
    bitmex_secret,
    binance_key,
    binance_secret,
    binance_us_key,
    binance_us_secret,
    kraken_key,
    kraken_secret,
    oanda_key,
    oanda_secret,
    token: tokens.createToken(user),
  };
};
module.exports = {
  createPassword,
  createRandomPassword,
  createUser,
  encryptUser,
  privateUser,
  publicUser,
};
