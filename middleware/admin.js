module.exports = function(req, res, next) {
  if (!req.user.admin)
    return res.status(401).send('Access denied, Not Authorized');
  return next();
};
