const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const http2 = require('node:http2');
const User = require('../models/user');

const { HTTP_STATUS_CREATED } = http2.constants;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => { next(err); });
};

module.exports.postUsers = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else { next(err); }
        });
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
