const pool = require('../db/skydax');
const data = require('../data/pairs.json');

const PairModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      short_name TEXT UNIQUE,
      combined_name TEXT UNIQUE,
      base TEXT REFERENCES instruments (instrument),
      quote TEXT REFERENCES instruments (instrument),
      on_binance BOOLEAN DEFAULT TRUE,
      on_binance_us BOOLEAN DEFAULT TRUE,
      on_bitmex BOOLEAN DEFAULT TRUE,
      on_kraken BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS pairs(${schema});`);
    } catch (err) {
      throw new Error('Pair table schema error');
    }
  },
  async selectPairs() {
    const sql = {
      select: 'SELECT * FROM pairs',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectPair(combined_name) {
    const sql = {
      select: 'SELECT * FROM pairs WHERE combined_name = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [combined_name]);
      if (!res.rows[0]) {
        throw new Error('Pair does not exist');
      }
      return res.rows[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async insertPairs() {
    const sql = {
      insert: `INSERT INTO pairs 
      (name, short_name, combined_name, base, quote, on_binance, on_binance_us, on_bitmex, on_kraken)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT(name) 
      DO NOTHING`,
    };
    try {
      data.forEach(pair => pool.query(sql.insert, pair));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = PairModel;
