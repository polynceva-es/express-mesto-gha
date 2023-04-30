const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const appRouter = require('express').Router();
const { login, createUser, celebrateParams } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/notFoundError');
const errorHandler = require('../middlewares/errorHadler');

const {
  name,
  about,
  avatar,
  email,
  password,
} = celebrateParams;

appRouter.use(bodyParser.json());
appRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email, password,
  }),
}), login);
appRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name, about, avatar, email, password,
  }),
}), createUser);
appRouter.use('/users', auth, usersRouter);
appRouter.use('/cards', auth, cardsRouter);
appRouter.use('*', (req, res, next) => { next(new NotFoundError('Страница не найдена')); });
appRouter.use(errors());
appRouter.use(errorHandler);

module.exports = appRouter;
