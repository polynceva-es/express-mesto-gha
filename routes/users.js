const usersRouter = require('express').Router();
const {
  getUsers,
  postUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.post('/', postUsers);
usersRouter.get('/:userId', getUserId);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
