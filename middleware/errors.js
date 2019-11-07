module.exports = function(winston) {
    return function(err, req, res) {
      if (err.message) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        winston.error(
          `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
            req.method
          } - ${req.ip}`,
        );
      }
      req.status(err.status || 500);
    };
  };
  