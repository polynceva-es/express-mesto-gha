const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Joi } = require('celebrate');
const http2 = require('node:http2');
const User = require('../models/user');
const getSecretKey = require('../utils/secretKey');
const { joiIsUrlValid } = require('../utils/isUrlValid');

const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = http2.constants;
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

module.exports.celebrateParams = {
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().custom(joiIsUrlValid),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
};

const getUserById = (userId, req, res, next) => {
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

const updateUser = (params, req, res, next) => {
  const id = req.user._id;
  User.findByIdAndUpdate(id, params, { new: true, runValidators: true })
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
      } else { next(err); }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => { next(err); });
};

module.exports.createUser = (req, res, next) => {
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
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          res
            .status(HTTP_STATUS_CREATED)
            .send(userObj);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else { next(err); }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, getSecretKey(), { expiresIn: '7d' });
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  getUserById(userId, req, res, next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  getUserById(userId, req, res, next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  updateUser({ name, about }, req, res, next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser({ avatar }, req, res, next);
};
