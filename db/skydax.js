const { Pool } = require('pg');
const { DATABASE_URL, SKYDAX_ENV } = process.env;

let connection = `${DATABASE_URL}?ssl=true`;

if (SKYDAX_ENV === 'development') {
  connection = DATABASE_URL;
}
const pool = new Pool({ connectionString: connection });

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
