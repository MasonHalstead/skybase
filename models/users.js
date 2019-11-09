const bcrypt = require('bcrypt');
const pool = require('../db/skydax');
const users = require('../utils/users');

const UserModel = {
  async schema() {
    const schema = `
      uuid TEXT PRIMARY KEY,
      admin BOOLEAN DEFAULT FALSE,
      email_address TEXT UNIQUE,
      email_verification TEXT,
      email_verified BOOLEAN DEFAULT FALSE,
      telephone BIGINT,
      telephone_verification BIGINT,
      telephone_verified BOOLEAN DEFAULT FALSE,
      text_messages BOOLEAN DEFAULT TRUE,
      first_name TEXT,
      last_name TEXT,
      password TEXT,
      temporary_password TEXT,
      wallet_address TEXT,
      bitmex_key TEXT,
      bitmex_secret TEXT,
      binance_key TEXT,
      binance_secret TEXT,
      binance_us_key TEXT,
      binance_us_secret TEXT,
      kraken_key TEXT,
      kraken_secret TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS users(${schema});`);
    } catch (err) {
      throw new Error('Users table schema error');
    }
  },
  async updateUserTelephone(uuid, telephone) {
    const sql = {
      update: `UPDATE users SET
        telephone = $2
        WHERE uuid = $1;`,
    };
    try {
      await pool.query(sql.update, [uuid, telephone]);
      return this.selectUser(uuid, false);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async verifyUserTelephone(uuid, telephone_verification) {
    const sql = {
      update: `UPDATE users SET
        telephone_verified = true
        WHERE uuid = $1;`,
    };
    try {
      const user = await this.selectUser(uuid, false);
      if (user.telephone_verification !== telephone_verification) {
        throw new Error('Telephone verification is not valid');
      }
      await pool.query(sql.update, [uuid]);
      return this.selectUser(uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async verifyUserEmail(email_verification) {
    const sql = {
      select: 'SELECT * FROM users WHERE email_verification = $1 LIMIT 1',
      update: `UPDATE users SET
        email_verified = true
        WHERE uuid = $1;`,
    };
    try {
      const res = await pool.query(sql.select, [email_verification]);
      if (!res.rows[0]) {
        throw new Error('Email authentication is not valid');
      }
      const [user] = res.rows;
      await pool.query(sql.update, [user.uuid]);
      return this.selectUser(user.uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async updateUserPassword(uuid, payload) {
    const { new_password } = payload;
    const sql = {
      update: `UPDATE users SET
        password = $2
        WHERE uuid = $1;`,
    };
    try {
      const password = await users.createPassword(new_password);
      await pool.query(sql.update, [uuid, password]);
      return this.selectUser(uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async updateUserResetPassword(uuid, payload) {
    const { temporary_password } = payload;
    const sql = {
      update: `UPDATE users SET
        temporary_password = $2
        WHERE uuid = $1;`,
    };
    try {
      const password = await users.createPassword(temporary_password);
      await pool.query(sql.update, [uuid, password]);
      return this.selectUser(uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async insertUser(payload) {
    const { email_address } = payload;
    const sql = {
      select: 'SELECT * FROM users WHERE email_address = $1 LIMIT 1',
      insert: `INSERT INTO users 
      (email_address, first_name, last_name, email_verification, telephone_verification, password, uuid)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
    };
    try {
      const res = await pool.query(sql.select, [email_address]);
      if (res.rows[0]) {
        throw new Error('User already exists');
      }
      const new_user = await users.createUser(payload);
      await pool.query(sql.insert, new_user);
      return this.selectUser(new_user[6], false);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async updateUser(uuid, payload) {
    const sql = {
      update: `UPDATE users SET
      first_name = COALESCE($2, first_name),
      last_name = COALESCE($3, last_name),
      telephone = COALESCE($4, telephone),
      wallet_address = COALESCE($5, wallet_address),
      text_messages = COALESCE($6, text_messages),
      password = COALESCE($7, password),
      bitmex_key = COALESCE($8, bitmex_key),
      bitmex_secret = COALESCE($9, bitmex_secret),
      binance_key = COALESCE($10, bitmex_key),
      binance_secret = COALESCE($11, binance_secret),
      binance_us_key = COALESCE($12, binance_us_key),
      binance_us_secret = COALESCE($13, binance_us_secret),
      kraken_key = COALESCE($14, kraken_key),
      kraken_secret = COALESCE($15, kraken_secret),
      updated_at = $16
      WHERE uuid = $1;`,
    };
    try {
      const user = await users.encryptUser(uuid, payload);
      await pool.query(sql.update, user);
      return this.selectUser(uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectUserEmailAddress(email_address) {
    const sql = {
      select: 'SELECT * FROM users WHERE email_address = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [email_address]);
      if (!res.rows[0]) {
        throw new Error('User does not exist');
      }
      return users.privateUser(res.rows[0]);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectUser(uuid, encrypt = true) {
    const sql = {
      select: 'SELECT * FROM users WHERE uuid = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      if (!res.rows[0]) {
        throw new Error('User does not exist');
      }
      if (encrypt) {
        const user = await users.privateUser(res.rows[0]);
        return user;
      }
      if (!encrypt) {
        const user = await users.publicUser(res.rows[0]);
        return user;
      }
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async loginUser({ email_address, password }) {
    const sql = {
      select: 'SELECT * FROM users WHERE email_address = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [email_address]);

      if (!res.rows[0]) {
        throw new Error('User does not exist');
      }

      const user = res.rows[0];
      const validate = await bcrypt.compare(password, user.password);

      if (!validate) {
        throw new Error('User is not authenticated');
      }

      return this.selectUser(user.uuid);
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = UserModel;
