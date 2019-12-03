const KrakenUtils = require('../utils/kraken');
const AuthService = require('./auth');
const PairModel = require('../models/pairs');
const OrderService = require('./orders');
const ActivityService = require('./activity');
const moment = require('moment');

const intervals = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '4h': '240',
  '1d': '1440',
  '1w': '10080',
  '2w': '21600',
};

const KrakenService = {
  async selectCandles({ pair, interval, start_date = '1970-01-01T00:00:00Z' }) {
    const unix = await moment(start_date).unix();
    const candles = await KrakenUtils.handleRequest({
      method: 'OHLC',
      options: {
        pair,
        since: unix,
        interval: intervals[interval],
      },
    });
    return candles;
  },
  async selectJobCandles({ pair, unix, interval }) {
    const candles = await KrakenUtils.handleRequest({
      method: 'OHLC',
      options: {
        pair,
        since: unix,
        interval: interval,
      },
    });
    return candles[pair];
  },
  async selectPairs() {
    const pairs = await KrakenUtils.handleRequest({
      method: `AssetPairs`,
    });
    return pairs;
  },
  async selectPair(pair) {
    const pairs = await KrakenUtils.handleRequest({
      method: 'AssetPairs',
      options: {
        pair,
      },
    });
    return pairs;
  },
  async selectInstruments() {
    const instruments = await KrakenUtils.handleRequest({
      method: `Assets`,
    });
    return instruments;
  },
  async selectInstrument(instrument) {
    const instruments = await KrakenUtils.handleRequest({
      method: 'Assets',
      options: {
        asset: instrument,
      },
    });
    return instruments;
  },
  async selectPositions(uuid) {
    const user = await AuthService.authKraken(uuid);
    const positions = await KrakenUtils.handleRequest({
      method: `OpenPositions`,
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return positions;
  },
  async selectWallet(uuid) {
    const user = await AuthService.authKraken(uuid);
    const wallet = await KrakenUtils.handleRequest({
      method: 'TradeBalance',
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return wallet;
  },
  async selectOrders(uuid) {
    const user = await AuthService.authKraken(uuid);
    const orders = await KrakenUtils.handleRequest({
      method: 'OpenOrders',
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return orders;
  },
  async selectOrder(uuid, txid) {
    const user = await AuthService.authKraken(uuid);
    const order = await KrakenUtils.handleRequest({
      method: 'QueryOrders',
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
      options: {
        txid,
      },
    });
    return order;
  },
  async createMarketOrders({ uuid, payload }) {
    const user = await AuthService.authKraken(uuid);
    const pair = await PairModel.selectPair(payload.pair);
    const options = await KrakenUtils.ordersMarket(payload);
    const market = await KrakenUtils.handleRequest({
      method: 'AddOrder',
      options,
      ...user,
    });
    const [order_id] = market.txid;
    const market_order = await this.selectOrder(uuid, order_id);
    const order = await OrderService.krakenMarketOrder({
      user,
      order_id: order_id,
      market: market_order[order_id],
      pair,
    });
    await ActivityService.activityKrakenOrder({ user, order, pair });
    return {
      skydax: order,
      kraken: market_order,
    };
  },
  async createLimitOrders({ uuid, payload }) {
    const user = await AuthService.authKraken(uuid);
    const pair = await PairModel.selectPair(payload.pair);
    const options = await KrakenUtils.ordersLimit(payload);
    const limit = await KrakenUtils.handleRequest({
      method: 'AddOrder',
      options,
      ...user,
    });
    const [order_id] = limit.txid;
    const limit_order = await this.selectOrder(uuid, order_id);
    const order = await OrderService.krakenMarketOrder({
      user,
      order_id: order_id,
      market: limit_order[order_id],
      pair,
    });
    await ActivityService.activityKrakenOrder({ user, order, pair });
    return {
      skydax: order,
      kraken: limit_order,
    };
  },
};

module.exports = KrakenService;
