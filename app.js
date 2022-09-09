require('dotenv').config();

const express = require('express');
const cors = require('cors');

const logger = require('./logger');
const routes = require('./routes');
const { authHandler, ...handlers } = require('./handlers');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(), express.json(), authHandler, ...routes, ...handlers);

app.listen(port, () => {
  logger.info(`App started on ${port}`);
});

module.exports = app;
