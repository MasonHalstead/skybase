const jwt = require('jsonwebtoken');

const { PRIVATE_KEY } = process.env;

const createToken = user => {
  const token = jwt.sign(
    {
      uuid: user.uuid,
      admin: user.admin,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      account_verified: user.account_verified,
    },
    PRIVATE_KEY,
    { expiresIn: '7d' },
  );
  return token;
};

module.exports = {
  createToken,
};
