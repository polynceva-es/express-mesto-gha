const jwt = require('jsonwebtoken');
const getSecretKey = require('../utils/secretKey');
const UnauthorisedError = require('../errors/unauthorisedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorisedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, getSecretKey());
  } catch (err) {
    next(new UnauthorisedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
