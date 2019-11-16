const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/skybase.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },
};
const logger = winston.createLogger({
  transports: [new winston.transports.File(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = {
  logger,
};
