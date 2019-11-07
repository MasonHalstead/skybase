const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = process.env;

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied, No token provided');
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    req.user = decoded;
    return next();
  } catch (ex) {
    return res.status(400).send('Invalid token');
  }
};
