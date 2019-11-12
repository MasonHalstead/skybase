const UserModel = require('../models/users');
const ActivityService = require('../services/activity');
const UserUtils = require('../utils/users');
const EmailEmitter = require('../subscribers/email');
const TextEmitter = require('../subscribers/text_message');

const UserService = {
  async registerUser(payload) {
    const user = await UserModel.insertUser(payload);
    EmailEmitter.emit('send_verify_email', user);
    return user.token;
  },
  async updateUserTelephone(uuid, telephone) {
    const user = await UserModel.updateUserTelephone(uuid, telephone);
    TextEmitter.emit('verify_telephone', user);
    return user.token;
  },
  async forgotUserPassword(email_address) {
    const user = await UserModel.selectUserEmailAddress(email_address);
    const temporary_password = UserUtils.createRandomPassword();
    await UserModel.updateUserResetPassword(user.uuid, { temporary_password });
    await EmailEmitter.emit('forgot_password_email', {
      email_address,
      temporary_password,
    });
    await ActivityService.activityResetUser({ user });
    return user.uuid;
  },
};

module.exports = UserService;
