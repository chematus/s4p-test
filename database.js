const logger = require('./logger');
const db = require('./models/index');

db.sequelize
  .authenticate()
  .then(() => {
    logger.info('DB connection established');
    db.sequelize.sync();
  })
  .catch((err) => {
    logger.error('Unable to connect to db: ', err);
  });

module.exports = db;
