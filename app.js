const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const http2 = require('node:http2');
const { login, createUser, celebrateParams } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const BadRequestError = require('./errors/badRequestError');
const NotFoundError = require('./errors/notFoundError');
const ConflictError = require('./errors/conflictError');
const UnauthorisedError = require('./errors/unauthorisedError');
const ForbiddenError = require('./errors/forbiddenError');

const {
  name,
  about,
  avatar,
  email,
  password,
} = celebrateParams;

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } = http2.constants;

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

/* eslint no-unused-vars: ["error", { "args": "none" }] */
function errorHandler(err, req, res, next) {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
  }
}

app.use(bodyParser.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email, password,
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name, about, avatar, email, password,
  }),
}), createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('*', (req, res, next) => { next(new NotFoundError('Страница не найдена')); });
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
