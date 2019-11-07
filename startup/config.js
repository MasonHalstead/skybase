module.exports = function(PRIVATE_KEY) {
  if (!PRIVATE_KEY) {
    throw new Error('FATAL ERROR: JWT token is not defined');
  }
};
