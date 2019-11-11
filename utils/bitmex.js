const crypto = require('crypto');
const request = require('request-promise');
const { BITMEX_HOST, BITMEX_KEY, BITMEX_SECRET } = process.env;

const headersBitmex = ({ bitmex_key, expires, signature }) => ({
  'content-type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': bitmex_key,
  'api-signature': signature,
});

const signatureBitmex = req =>
  crypto
    .createHmac('sha256', req.bitmex_secret)
    .update(`${req.verb}${req.route}${req.expires}${req.data}`)
    .digest('hex');

const minutesBitmex = (minutes = 1) => {
  const seconds = minutes * 60;
  return Math.round(new Date().getTime() / 1000) + seconds;
};

const requestOptionsBitmex = async req => {
  const { verb, route, bitmex_key, data } = req;
  const expires = minutesBitmex();
  const signature = signatureBitmex({ ...req, expires });
  const headers = headersBitmex({ bitmex_key, expires, signature });
  return {
    headers,
    url: `${BITMEX_HOST}${route}`,
    method: verb,
    body: data,
  };
};

const leverage = options => {
  const { symbol, leverage } = options;
  if (!symbol || !leverage) {
    throw new Error('Invalid position leverage update');
  }
  return {
    symbol,
    leverage,
  };
};

const ordersStop = options => {
  const {
    verb,
    route,
    type,
    symbol,
    side,
    qty,
    stop_px,
    execution_instructions,
  } = options;
  if (!verb || !route || !type || !symbol || !qty || !stop_px) {
    throw new Error('Invalid stop order');
  }
  return {
    verb,
    route,
    ordType: type,
    symbol,
    orderQty: qty,
    side,
    execInsts: execution_instructions,
    stopPx: stop_px,
  };
};

const ordersStopLimit = options => {
  const {
    verb,
    route,
    type,
    symbol,
    qty,
    stop_px,
    price,
    execution_instructions,
  } = options;
  if (!verb || !route || !type || !symbol || !qty || !stop_px || !price) {
    throw new Error('Invalid stop limit order');
  }
  return {
    verb,
    route,
    ordType: type,
    symbol,
    orderQty: qty,
    price,
    stopPx: stop_px,
    execInsts: execution_instructions,
  };
};

const ordersMarket = options => {
  const {
    verb,
    route,
    type,
    symbol,
    qty,
    side,
    display_qty,
    execution_instructions,
  } = options;
  if (!verb || !route || !type || !symbol || !qty) {
    throw new Error('Invalid market order');
  }
  return {
    verb,
    route,
    ordType: type,
    symbol,
    orderQty: qty,
    side,
    execInsts: execution_instructions,
    displayQty: display_qty,
  };
};

const ordersLimit = options => {
  const {
    verb,
    route,
    type,
    symbol,
    qty,
    price,
    execution_instructions,
  } = options;
  if (!verb || !route || !type || !symbol || !qty || !price) {
    throw new Error('Invalid limit order');
  }
  return {
    verb,
    route,
    ordType: type,
    symbol,
    orderQty: qty,
    price,
    execInsts: execution_instructions,
  };
};

const ordersUpdate = options => {
  const {
    verb,
    route,
    qty,
    price,
    order_id,
    client_order_id,
    leave_qty,
    stop_px,
    peg_offset_value,
  } = options;
  if (!verb || !route || !order_id || !client_order_id || !qty || !price) {
    throw new Error('Invalid order update');
  }
  return {
    verb,
    route,
    orderID: order_id,
    origClOrdID: client_order_id,
    quantity: qty,
    price,
    leavesQty: leave_qty,
    stopPx: stop_px,
    pegOffsetValue: peg_offset_value,
  };
};
const handleRequest = async ({
  verb,
  route,
  bitmex_key,
  bitmex_secret,
  payload = {},
}) => {
  const data = JSON.stringify(payload);
  const request_options = await requestOptionsBitmex({
    verb,
    route,
    data,
    bitmex_key,
    bitmex_secret,
  });
  const results = await request(request_options);
  return JSON.parse(results);
};

const handleComposites = async ({
  instrument,
  start_date,
  end_date,
  count = 500,
}) => {
  const options = {
    verb: 'GET',
    route: encodeURI(
      `/api/v1/instrument/compositeIndex?symbol=${instrument}&count=${count}&startTime=${start_date}&endTime=${end_date}&filter={"reference":"BMI"}`,
    ),
  };
  const data = JSON.stringify({});
  const request_options = await requestOptionsBitmex({
    ...options,
    data,
    bitmex_key: BITMEX_KEY,
    bitmex_secret: BITMEX_SECRET,
  });
  const results = await request(request_options);
  return JSON.parse(results);
};

const handleCandles = async ({
  pair,
  interval,
  start_date,
  end_date,
  count = 1000,
}) => {
  const options = {
    verb: 'GET',
    route: encodeURI(
      `/api/v1/trade/bucketed?binSize=${interval}&symbol=${pair}&startTime=${start_date}&endTime=${end_date}&count=${count}`,
    ),
  };
  const data = JSON.stringify({});
  const request_options = await requestOptionsBitmex({
    ...options,
    data,
    bitmex_key: BITMEX_KEY,
    bitmex_secret: BITMEX_SECRET,
  });
  const results = await request(request_options);
  return JSON.parse(results);
};

module.exports = {
  leverage,
  ordersUpdate,
  ordersLimit,
  ordersMarket,
  ordersStop,
  ordersStopLimit,
  handleCandles,
  handleComposites,
  handleRequest,
};
