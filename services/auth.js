const UserModel = require('../models/users');
const BitmexUtils = require('../utils/bitmex');

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
};

module.exports = AuthService;
