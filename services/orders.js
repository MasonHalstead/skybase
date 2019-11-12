const OrderModel = require('../models/orders');

const OrderService = {
  async bitmexLimitOrder({ user, limit, pair }) {
    const order = await OrderModel.createOrder({
      customer_id: user.uuid,
      exchange_id: 1,
      exchange_account_id: limit.account,
      exchange_order_id: limit.orderID,
      exchange_order_status: limit.ordStatus,
      pair_id: pair.id,
      order_type_id: 1,
      side: limit.side,
      quantity: limit.cumQty,
      price: limit.avgPx,
      status_id: 1,
    });
    return order;
  },
  async bitmexMarketOrder({ user, market, pair }) {
    const order = await OrderModel.createOrder({
      customer_id: user.uuid,
      exchange_id: 1,
      exchange_account_id: market.account,
      exchange_order_id: market.orderID,
      exchange_order_status: market.ordStatus,
      pair_id: pair.id,
      order_type_id: 2,
      side: market.side,
      quantity: market.cumQty,
      price: market.avgPx,
      status_id: 1,
    });
    return order;
  },
  async bitmexStopOrder({ user, stop, pair }) {
    const order = await OrderModel.createOrder({
      customer_id: user.uuid,
      exchange_id: 1,
      exchange_account_id: stop.account,
      exchange_order_id: stop.orderID,
      exchange_order_status: stop.ordStatus,
      pair_id: pair.id,
      order_type_id: 3,
      side: stop.side,
      quantity: stop.cumQty,
      price: stop.avgPx,
      status_id: 1,
    });
    return order;
  },
  async bitmexStopLimitOrder({ user, stop, pair }) {
    const order = await OrderModel.createOrder({
      customer_id: user.uuid,
      exchange_id: 1,
      exchange_account_id: stop.account,
      exchange_order_id: stop.orderID,
      exchange_order_status: stop.ordStatus,
      pair_id: pair.id,
      order_type_id: 4,
      side: stop.side,
      quantity: stop.cumQty,
      price: stop.avgPx,
      status_id: 1,
    });
    return order;
  },
};

module.exports = OrderService;
