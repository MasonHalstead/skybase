const KrakenUtils = require('../utils/kraken');
const AuthService = require('./auth');
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
    const candles = await KrakenUtils.handlePublicRequest({
      method: `OHLC?pair=${pair}&since=${unix}&interval=${intervals[interval]}`,
    });
    return candles;
  },
  async selectJobCandles({ pair, start_date, interval }) {
    const candles = await KrakenUtils.handlePublicRequest({
      method: `OHLC?pair=${pair}&interval=${interval}&since=${start_date}`,
    });
    return candles[pair];
  },
  async selectPairs() {
    const pairs = await KrakenUtils.handlePublicRequest({
      method: `AssetPairs`,
    });
    return pairs;
  },
  async selectPair(pair) {
    const pairs = await KrakenUtils.handlePublicRequest({
      method: `AssetPairs?pair=${pair}`,
    });
    return pairs;
  },
  async selectInstruments() {
    const instruments = await KrakenUtils.handlePublicRequest({
      method: `Assets`,
    });
    return instruments;
  },
  async selectInstrument(instrument) {
    const instruments = await KrakenUtils.handlePublicRequest({
      method: `Assets?asset=${instrument}`,
    });
    return instruments;
  },
  async selectPositions(uuid) {
    const user = await AuthService.authKraken(uuid);
    const positions = await KrakenUtils.handlePrivateRequest({
      method: `OpenPositions`,
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return positions;
  },
  async selectWallet(uuid) {
    const user = await AuthService.authKraken(uuid);
    const wallet = await KrakenUtils.handlePrivateRequest({
      method: 'TradeBalance',
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return wallet;
  },
  async selectOrders(uuid) {
    const user = await AuthService.authKraken(uuid);
    const orders = await KrakenUtils.handlePrivateRequest({
      method: 'OpenOrders',
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    return orders;
  },
  async createOrders({ uuid, order_type, ...rest }) {
    const user = await AuthService.authKraken(uuid);
    const query = await KrakenUtils.orders(order_type, rest);
    const order = await KrakenUtils.handlePrivateRequest({
      method: `AddOrder?${query}`,
      kraken_secret: user.kraken_secret,
      kraken_key: user.kraken_key,
    });
    // await k.activityKrakenOrder({ user, order: payload });
    return order;
  },
};

module.exports = KrakenService;
