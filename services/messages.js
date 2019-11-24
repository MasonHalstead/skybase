const UserModel = require('../models/users');
const TextEmitter = require('../subscribers/text_message');

const MessageService = {
  async sendMessage({ uuid, message }) {
    const user = await UserModel.selectUser(uuid);
    await TextEmitter.emit('message', { user, message });
    return message;
  },
};

module.exports = MessageService;
