const KrakenClient = require('@warren-bank/node-kraken-api');

const handleRequest = async ({
  method,
  options = {},
  kraken_key = null,
  kraken_secret = null,
}) => {
  const kraken = new KrakenClient(kraken_key, kraken_secret, {
    timeout: 10000,
  });
  try {
    return await kraken.api(method, options);
  } catch (err) {
    throw new Error(err);
  }
};

const ordersLimit = options => {
  const { type, pair, price, volume, leverage } = options;

  let order = {
    ordertype: 'limit',
    price,
    volume,
    type,
    pair,
  };

  if (!pair || !type || !price || !volume) {
    throw new Error('Invalid Kraken order');
  }
  if (leverage) {
    order.leverage = leverage;
  }
  return order;
};

const ordersMarket = options => {
  const { type, pair, volume, leverage } = options;

  let order = {
    ordertype: 'market',
    volume,
    type,
    pair,
  };

  if (!pair || !type || !volume) {
    throw new Error('Invalid Kraken order');
  }
  if (leverage) {
    order.leverage = leverage;
  }
  return order;
};

module.exports = {
  handleRequest,
  ordersMarket,
  ordersLimit,
};
