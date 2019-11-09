const pool = require('../db/skydax');
const data = require('../data/order_types.json');

const OrderTypeModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      query_name TEXT,
      on_binance BOOLEAN DEFAULT TRUE,
      on_binance_us BOOLEAN DEFAULT TRUE,
      on_bitmex BOOLEAN DEFAULT TRUE,
      on_kraken BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS order_types(${schema});`);
    } catch (err) {
      throw new Error('Order type table schema error');
    }
  },
  async selectOrderTypes() {
    const sql = {
      select: 'SELECT * FROM order_types',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async insertOrderTypes() {
    const sql = {
      insert: `INSERT INTO order_types 
      (name, query_name)
      VALUES($1, $2)
      ON CONFLICT(name) 
      DO NOTHING`,
    };
    try {
      data.forEach(order_type => pool.query(sql.insert, order_type));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = OrderTypeModel;
