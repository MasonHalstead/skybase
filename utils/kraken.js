const crypto = require('crypto');
const request = require('request-promise');
const qs = require('querystring');
const moment = require('moment');
const { KRAKEN_HOST } = process.env;

const signatureKraken = ({ route, data, nonce, kraken_secret }) => {
  const message = qs.stringify(data);
  const secret = new Buffer.from(kraken_secret, 'base64');
  let hash = new crypto.createHash('sha256');
  let hmac = new crypto.createHmac('sha512', secret);
  const hashDigest = hash.update(nonce + message).digest('binary');
  const hmacDigest = hmac.update(route + hashDigest, 'binary').digest('base64');

  return hmacDigest;
};

const handleRequestError = res => {
  const res_parsed = JSON.parse(res);
  const { error, result } = res_parsed;
  if (error.length > 0) {
    throw new Error(error[0]);
  }
  return result;
};

const handlePrivateRequest = async ({ method, kraken_key, kraken_secret }) => {
  try {
    const route = `/0/private/${method}`;
    const uri = `${KRAKEN_HOST}${route}`;
    const nonce = new Date() * 1000;
    const signature = signatureKraken({
      route,
      data: { nonce },
      nonce,
      kraken_secret,
    });
    const options = {
      uri,
      headers: {
        'User-Agent': 'Kraken Node API Client',
        'API-Key': kraken_key,
        'API-Sign': signature,
      },
      method: 'POST',
      body: qs.stringify({ nonce }),
    };
    const res = await request(options);
    return handleRequestError(res);
  } catch {
    throw new Error('Error handling Kraken request');
  }
};

const handlePublicRequest = async ({ method }) => {
  try {
    const route = `/0/public/${method}`;
    const uri = `${KRAKEN_HOST}${route}`;
    const options = {
      uri,
      headers: {
        'User-Agent': 'Kraken Node API Client',
      },
      method: 'GET',
    };
    const res = await request(options);
    return handleRequestError(res);
  } catch {
    throw new Error('Error handling Kraken request');
  }
};

const orders = (order, options) => {
  const {
    type,
    price,
    trigger_price,
    volume,
    leverage,
    start_date,
    expires_date,
  } = options;

  let unix_start;
  let unix_expires;

  if (!order || !type || !price || !volume || !leverage) {
    throw new Error('Invalid Kraken order');
  }
  if (start_date) {
    unix_start = moment(start_date).unix();
  }
  if (expires_date) {
    unix_expires = moment(expires_date).unix();
  }
  const kraken_query = {
    ordertype: order,
    type,
    price,
    price2: trigger_price,
    volume,
    leverage,
    starttm: unix_start,
    expiretm: unix_expires,
  };
  return qs.stringify(kraken_query);
};

module.exports = {
  handlePrivateRequest,
  handlePublicRequest,
  orders,
};
