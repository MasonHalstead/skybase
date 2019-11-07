const UserModel = require('../models/users');
const ActivityModel = require('../models/account_activity');
const UserUtils = require('../utils/users');
const EmailEmitter = require('../subscribers/email');

const UserService = {
  async registerUser(payload) {
    const user = await UserModel.createUser(payload);
    EmailEmitter.emit('send_verify_email', user);
    return user.uuid;
  },
  async forgotUserPassword(email_address) {
    const user = await UserModel.selectUserEmailAddress(email_address);
    const temporary_password = UserUtils.createRandomPassword();
    await UserModel.updateUserResetPassword(user.uuid, { temporary_password });
    await EmailEmitter.emit('forgot_password_email', {
      email_address,
      temporary_password,
    });
    await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `Sent password reset to ${email_address}`,
      reference_table: null,
      reference_column: null,
      reference_id: null,
    });
    return user.uuid;
  },
};

module.exports = UserService;
