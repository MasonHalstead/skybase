const pool = require('../db/skydax');

const WalletModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      address TEXT,
      name TEXT,
      satoshi_balance DOUBLE PRECISION DEFAULT 0
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS wallets(${schema});`);
    } catch (err) {
      throw new Error('Wallet table schema error');
    }
  },
  async createWallet(payload) {
    const { address, name } = payload;

    const sql = {
      insert: `INSERT INTO wallets 
      (address, name)
      VALUES($1, $2)
      RETURNING *`,
    };
    try {
      const res = await pool.query(sql.insert, [address, name]);
      return res.rows[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectWallets(uuid) {
    const sql = {
      select: 'SELECT * FROM wallets',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async updateWalletBalance(wallet_id, satoshi_balance) {
    const sql = {
      update: `UPDATE wallets SET
        satoshi_balance = $2
        WHERE id = $1
        RETURNING *;`,
    };
    try {
      const res = await pool.query(sql.update, [wallet_id, satoshi_balance]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = WalletModel;
