const crypto = require('crypto');
const request = require('request-promise');
const { KRAKEN_HOST } = process.env;

const headersKraken = ({ kraken_key, nonce, signature }) => ({
  'content-type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  nonce: nonce,
  'API-Key': kraken_key,
  'API-Sign': signature,
});

const signatureKraken = ({ route, kraken_secret, nonce, data }) => {
  const hash = crypto.createHash('sha256');
  const hmac = crypto.createHmac('sha512', kraken_secret);
  const hash_digest = hash.update(nonce + data).digest('binary');
  const hmac_digest = hmac
    .update(route + hash_digest, 'binary')
    .digest('base64');

  return hmac_digest;
};

const minutesKraken = (minutes = 1) => {
  const seconds = minutes * 60;
  return Math.round(new Date().getTime() / 1000) + seconds;
};

const requestOptionsKraken = async ({
  route,
  kraken_key = 'None',
  kraken_secret = 'None',
  data,
}) => {
  const nonce = minutesKraken();
  const signature = signatureKraken({ data, route, nonce, kraken_secret });
  const headers = headersKraken({ kraken_key, nonce, signature });
  return {
    headers,
    url: `${KRAKEN_HOST}${route}`,
    body: data,
  };
};

const handleRequest = async ({
  route,
  kraken_key = 'KRAKEN_PUBLIC',
  kraken_secret = 'KRAKEN_PUBLIC',
  payload = {},
}) => {
  const data = JSON.stringify(payload);
  const request_options = await requestOptionsKraken({
    route,
    data,
    kraken_key,
    kraken_secret,
  });
  const res = await request(request_options);
  const parsed = JSON.parse(res);
  return parsed.result;
};

module.exports = {
  handleRequest,
};
