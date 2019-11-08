const { Pool } = require('pg');
const { BINANCE_DATABASE_URL } = process.env;

let connection = `${BINANCE_DATABASE_URL}`;
const pool = new Pool({ connectionString: connection });

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
