const pool = require('../db/skydax');

const OrderModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      customer_id TEXT REFERENCES users (uuid),
      exchange_id INT REFERENCES exchanges (id),
      exchange_account_id TEXT,
      instrument_id INT REFERENCES instruments (id),
      order_type_id INT REFERENCES order_types (id),
      side TEXT,
      quantity NUMERIC,
      price NUMERIC,
      status_id INT REFERENCES status (id),
      date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS orders(${schema});`);
    } catch (err) {
      throw new Error('Order table schema error');
    }
  },
  async createOrder(payload) {
    const {
      customer_id,
      exchange_id,
      exchange_account_id,
      instrument_id,
      order_type_id,
      side,
      quantity,
      price,
      status_id,
    } = payload;
    const sql = {
      insert: `INSERT INTO orders 
      (customer_id, exchange_id, exchange_account_id, instrument_id, order_type_id, side, quantity, price, status_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
    };
    try {
      const res = await pool.query(sql.insert, [
        customer_id,
        exchange_id,
        exchange_account_id,
        instrument_id,
        order_type_id,
        side,
        quantity,
        price,
        status_id,
      ]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectUserOrder(uuid) {
    const sql = {
      select: 'SELECT * FROM orders WHERE customer_id = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};
module.exports = OrderModel;
