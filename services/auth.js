const UserModel = require('../models/users');
const BitmexUtils = require('../utils/bitmex');
const KrakenUtils = require('../utils/kraken');

const AuthService = {
  async verifyBitmex(payload) {
    const { uuid } = payload;
    const user = await UserModel.selectUser(uuid, false);
    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }
    await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/user',
      ...user,
    });
    return user.token;
  },
  async authBitmex(uuid) {
    const user = await UserModel.selectUser(uuid, false);
    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }
    return user;
  },
  async verifyKraken(payload) {
    const { uuid } = payload;
    const user = await UserModel.selectUser(uuid, false);
    if (!user.kraken_key || !user.kraken_secret) {
      throw new Error('Invalid Kraken API credentials');
    }
    await KrakenUtils.handlePrivateRequest({
      method: `Balance`,
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return user.token;
  },
  async authKraken(uuid) {
    const user = await UserModel.selectUser(uuid, false);
    if (!user.kraken_key || !user.kraken_secret) {
      throw new Error('Invalid Kraken API credentials');
    }
    return user;
  },
};

module.exports = AuthService;
