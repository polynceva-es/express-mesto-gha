const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
  celebrateParams,
} = require('../controllers/users');

const {
  name,
  about,
  avatar,
} = celebrateParams;

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:userId', getUserId);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name, about,
  }),
}), updateUserInfo);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({ avatar }),
}), updateUserAvatar);

module.exports = usersRouter;
