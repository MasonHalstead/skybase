const UserModel = require('./users');
const ActivityModel = require('./activity');
const CandleModel = require('./candles');
const ExchangeModel = require('./exchanges');
const PairModel = require('./pairs');
const FundModel = require('./funds');
const InstrumentModel = require('./instruments');
const IntervalModel = require('./intervals');
const StatusModel = require('./status');
const ManagedStrategyModel = require('./managed_strategies');
const StrategyModel = require('./strategies');
const StrategyQueueModel = require('./strategy_queue');
const OrderTypeModel = require('./order_types');
const OrderModel = require('./orders');
const WalletModel = require('./wallets');

module.exports = async function() {
  try {
    console.log('Building Table Schema');

    // Create tables
    await UserModel.schema();
    await ActivityModel.schema();
    await CandleModel.schema();
    await ExchangeModel.schema();
    await InstrumentModel.schema();
    await PairModel.schema();
    await FundModel.schema();
    await IntervalModel.schema();
    await StatusModel.schema();
    await ManagedStrategyModel.schema();
    await StrategyModel.schema();
    await StrategyQueueModel.schema();
    await OrderTypeModel.schema();
    await OrderModel.schema();
    await WalletModel.schema();

    // Insert lookups
    await ExchangeModel.insertExchanges();
    await InstrumentModel.insertInstruments();
    await IntervalModel.insertIntervals();
    await OrderTypeModel.insertOrderTypes();
    await PairModel.insertPairs();
    await StatusModel.insertStatus();
  } catch (err) {
    throw new Error('Error building table schema');
  }
};
