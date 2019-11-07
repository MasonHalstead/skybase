const favicon = require('serve-favicon');
module.exports = function(app) {
  app.use(favicon('./public/favicon.ico'));
};
