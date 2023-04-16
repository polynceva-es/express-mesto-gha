const mongoose = require('mongoose');
const User = require('../models/user');
const http2 = require('node:http2');
const { HTTP_STATUS_CREATED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND} = http2.constants;

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users)=> {
    res.send(users);
  })
  .catch((err)=> {next(err)});
};

module.exports.postUsers = (req, res, next) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.status(HTTP_STATUS_CREATED).send(user))
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Переданы некорректные данные при создании пользователя'});
      } else {next(err)}
})

};

module.exports.getUserId = (req, res, next) => {
  const {userId} = req.params;
  User.findById(userId)
    .then(user => {
      if(user){
        res.send(user)
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${userId} не найден`});
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${userId} не найден`});
      } else {next(err)}
});
};

module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const {name, about} = req.body;
   User.findByIdAndUpdate(id, {name, about}, {new: true, runValidators: true})
    .then(user => {
      if(user) {
        res.send(user)
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${id} не найден`});
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Переданы некорректные данные при обновлении профиля'});
      }
      if(err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${id} не найден`});
      }
      else {next(err)}
    })
};

module.exports.updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const {avatar} = req.body;
   User.findByIdAndUpdate(id, {avatar}, {new: true, runValidators: true})
    .then(user => {
      if(user) {
        res.send(user)
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${id} не найден`});
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Переданы некорректные данные при обновлении аватара'});
      }
      if(err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Пользователь по указанному id:${id} не найден`});
      }
      else {next(err)}
    })
};