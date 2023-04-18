const mongoose = require('mongoose');
const http2 = require('node:http2');
const User = require('../models/user');

const { HTTP_STATUS_CREATED } = http2.constants;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => { next(err); });
};

module.exports.postUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else { next(err); }
    });
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь по указанному id:${userId} не найден`);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Пользователь по указанному id:${userId} не найден`));
      } else { next(err); }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Пользователь по указанному id:${id} не найден`));
      } else { next(err); }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Пользователь по указанному id:${id} не найден`));
      } else { next(err); }
    });
};
