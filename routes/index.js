const contentRouter = require('./content.routes');
const userRouter = require('./user.routes');

module.exports = {
  contentRouter,
  userRouter,
  * [Symbol.iterator]() {
    yield* Object.values(this);
  },
};
