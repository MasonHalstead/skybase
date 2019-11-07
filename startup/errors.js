const morgan = require('morgan');
const winston = require('./winston');
const chalk = require('./chalk');

module.exports = function(app) {
  app.use(chalk);
  app.use(morgan('combined', { stream: winston.logger.stream }));
};
