const winston = require('winston');

module.exports = winston.createLogger({
  level: process.env.LOGGING_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((data) => `[${data.timestamp}] (${data.level}) ${data.message}`),
  ),
  transports: [
    new winston.transports.File({ filename: 'log.txt' }),
    new winston.transports.Console(),
  ],
});
