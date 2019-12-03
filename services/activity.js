const ActivityModel = require('../models/activity');
const TextEmitter = require('../subscribers/text_message');

const ActivityService = {
  async activityBitmexOrder({ user, order, pair }) {
    const activity = await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `BitMEX ${order.side} order ${order.exchange_order_status} ${order.quantity} ${pair.combined_name} at ${order.price}.`,
      reference_table: 'orders',
      reference_column: 'id',
      reference_id: order.id,
    });
    TextEmitter.emit('order', { user, activity });
    return activity;
  },
  async activityKrakenOrder({ user, order, pair }) {
    const activity = await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `Kraken ${order.side} order ${order.exchange_order_status} ${order.quantity} ${pair.combined_name} at ${order.price}.`,
      reference_table: 'orders',
      reference_column: 'id',
      reference_id: order.id,
    });
    TextEmitter.emit('order', { user, activity });
    return activity;
  },
  async activityResetUser({ user }) {
    const activity = await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `Sent password reset to ${user.email_address}`,
      reference_table: null,
      reference_column: null,
      reference_id: null,
    });
    return activity;
  },
  async activityLeverage({ user, leverage }) {
    const activity = await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `Set ${leverage.symbol} leverage to ${leverage.leverage}`,
      reference_table: null,
      reference_column: null,
      reference_id: null,
    });
    return activity;
  },
};

module.exports = ActivityService;
