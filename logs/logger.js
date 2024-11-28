const {createLogger, format, transports} = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'http',
  format: format.json(),
  transports: [
    new transports.File(
        {filename: path.join(__dirname, 'history', 'combined.log')}),
    new transports.File({
      filename: path.join(__dirname, 'history', 'error.log'),
      level: 'error'
    }),
  ],
});

if (process.env.NODE_ENV != 'production') {
  logger.add(new transports.Console({format: format.simple()}));
};

module.exports = logger;