const UserModel = require('../models/users');
const BitmexUtils = require('../utils/bitmex');
const ActivityModel = require('../models/activity');

const BitmexService = {
  async selectCandles({ uuid, pair, payload }) {
    let { count, interval, start_date, end_date } = payload;

    count = count || 1000;
    interval = interval || '1m';
    start_date = start_date || '1970-01-01T00:00:00Z';

    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

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
    let { count } = payload;

    count = count || 1;

    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

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
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

    const instruments = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(`/api/v1/instrument?symbol=${instrument}`),
      ...user,
    });

    return instruments[0] || {};
  },
  async selectTrades({ uuid, pair, payload }) {
    let { count } = payload;
    const user = await UserModel.selectUser(uuid, false);

    count = count || 100;
    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

    const price = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: `/api/v1/trade?symbol=${pair}&count=${count}&partial=false`,
      ...user,
    });
    return price;
  },
  async selectPositions(uuid) {
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

    const positions = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/position',
      ...user,
    });
    return positions;
  },
  async selectPosition({ uuid, pair }) {
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

    const positions = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: encodeURI(`/api/v1/position?filter={"symbol":"${pair}"}`),
      ...user,
    });
    return positions[0] || {};
  },
  async updateLeverage({ uuid, payload }) {
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }
    const data = BitmexUtils.leverage(payload);
    const leverage = await BitmexUtils.handleRequest({
      verb: 'POST',
      route: `/api/v1/position/leverage`,
      payload: data,
      ...user,
    });
    await ActivityModel.createActivy({
      uuid: user.uuid,
      message: `Set ${leverage.symbol} leverage to ${leverage.leverage}`,
      reference_table: null,
      reference_column: null,
      reference_id: null,
    });
    return leverage;
  },
  async selectWallet(uuid) {
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

    const wallet = await BitmexUtils.handleRequest({
      verb: 'GET',
      route: '/api/v1/user/margin',
      ...user,
    });

    return wallet;
  },
  async selectWalletHistory(uuid) {
    const user = await UserModel.selectUser(uuid, false);

    if (!user.bitmex_key || !user.bitmex_secret) {
      throw new Error('Invalid Bitmex API credentials');
    }

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
