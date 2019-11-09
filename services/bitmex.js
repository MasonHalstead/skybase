const UserModel = require('../models/users');
const ActivityModel = require('../models/activity');
const UserUtils = require('../utils/users');
const EmailEmitter = require('../subscribers/email');
const TextEmitter = require('../subscribers/text_message');

const BitmexService = {
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

module.exports = BitmexService;
