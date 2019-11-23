const BitmexUtils = require('../utils/bitmex');
const AuthService = require('./auth');
const PairModel = require('../models/pairs');
const OrderService = require('./orders');
const ActivityService = require('./activity');
const moment = require('moment');

const BitmexService = {
  async selectCandles({
    uuid,
    pair,
    count = 1000,
    interval = '1m',
    start_date = '1970-01-01T00:00:00Z',
    end_date = moment.utc().format(),
  }) {
    const user = await AuthService.authBitmex(uuid);
    const candles = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(
        `/api/v1/trade/bucketed?binSize=${interval}&symbol=${pair}&count=${count}&startTime=${start_date}&endTime=${end_date}&partial=false`,
      ),
      ...user,
    });
    return candles;
  },
  async selectFunding({ uuid, pair, payload }) {
    const user = await AuthService.authBitmex(uuid);

    let { count } = payload;
    count = count || 1;

    const funding = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(
        `/api/v1/funding?symbol=${pair}&count=${count}&partial=false`,
      ),
      ...user,
    });
    return funding;
  },
  async selectInstrument({ uuid, instrument }) {
    const user = await AuthService.authBitmex(uuid);

    const instruments = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(`/api/v1/instrument?symbol=${instrument}`),
      ...user,
    });

    return instruments[0] || {};
  },
  async selectTrades({ uuid, pair, payload }) {
    const user = await AuthService.authBitmex(uuid);

    let { count } = payload;
    count = count || 100;

    const price = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: `/api/v1/trade?symbol=${pair}&count=${count}&partial=false`,
      ...user,
    });
    return price;
  },
  async createLimitOrders({ uuid, payload }) {
    const { symbol } = payload;
    const user = await AuthService.authBitmex(uuid);
    const pair = await PairModel.selectPair(symbol);
    const post_data = await BitmexUtils.ordersLimit(payload);
    const limit = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: '/api/v1/order',
      payload: post_data,
      ...user,
    });
    const order = await OrderService.bitmexLimitOrder({ user, limit, pair });
    await ActivityService.activityBitmexOrder({ user, order, pair });
    return order;
  },
  async createMarketOrders({ uuid, payload }) {
    const { symbol } = payload;
    const user = await AuthService.authBitmex(uuid);
    const pair = await PairModel.selectPair(symbol);
    const post_data = await BitmexUtils.ordersMarket(payload);
    const market = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: '/api/v1/order',
      payload: post_data,
      ...user,
    });
    const order = await OrderService.bitmexMarketOrder({ user, market, pair });
    await ActivityService.activityBitmexOrder({ user, order, pair });
    return order;
  },
  async createStopOrders({ uuid, payload }) {
    const { symbol } = payload;
    const user = await AuthService.authBitmex(uuid);
    const pair = await PairModel.selectPair(symbol);
    const post_data = await BitmexUtils.ordersStop(payload);
    const stop = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: '/api/v1/order',
      payload: post_data,
      ...user,
    });
    const order = await OrderService.bitmexStopOrder({ user, stop, pair });
    await ActivityService.activityBitmexOrder({ user, order, pair });
    return order;
  },
  async createStopLimitOrders({ uuid, payload }) {
    const { symbol } = payload;
    const user = await AuthService.authBitmex(uuid);
    const pair = await PairModel.selectPair(symbol);
    const post_data = await BitmexUtils.ordersStopLimit(payload);
    const stop = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: '/api/v1/order',
      payload: post_data,
      ...user,
    });
    const order = await OrderService.bitmexStopOrder({ user, stop, pair });
    await ActivityService.activityBitmexOrder({ user, order, pair });
    return order;
  },
  async selectOrders(uuid) {
    const user = await AuthService.authBitmex(uuid);
    const orders = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/order',
      ...user,
    });
    return orders;
  },
  async selectPositions(uuid) {
    const user = await AuthService.authBitmex(uuid);
    const positions = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/position',
      ...user,
    });
    return positions;
  },
  async selectPosition({ uuid, pair }) {
    const user = await AuthService.authBitmex(uuid);
    const positions = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(`/api/v1/position?filter={"symbol":"${pair}"}`),
      ...user,
    });
    return positions[0] || {};
  },
  async updateLeverage({ uuid, payload }) {
    const user = await AuthService.authBitmex(uuid);
    const data = BitmexUtils.leverage(payload);
    const leverage = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: `/api/v1/position/leverage`,
      payload: data,
      ...user,
    });
    await ActivityService.activityLeverage({ user, leverage });
    return leverage;
  },
  async selectWallet(uuid) {
    const user = await AuthService.authBitmex(uuid);
    const wallet = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/user/margin',
      ...user,
    });

    return wallet;
  },
  async selectWalletHistory(uuid) {
    const user = await AuthService.authBitmex(uuid);
    const wallets = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/user/walletHistory',
      ...user,
    });

    return wallets
      .filter(wallet => wallet.transactType === 'RealisedPNL')
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  },
};

module.exports = BitmexService;
