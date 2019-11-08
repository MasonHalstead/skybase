const pool = require('../db/skydax');

const OrderTypesModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT,
      query_name TEXT,
      on_binance BOOLEAN DEFAULT TRUE,
      on_binance_us BOOLEAN DEFAULT TRUE,
      on_bitmex BOOLEAN DEFAULT TRUE,
      on_kraken BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_DATE
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
};

module.exports = OrderTypesModel;
