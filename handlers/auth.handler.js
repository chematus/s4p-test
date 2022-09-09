const jwt = require('jsonwebtoken');

module.exports = ((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      next(err);
    }
  }
  next();
});
