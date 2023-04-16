const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  console.log('getUsers');
  User.find({})
  .then((users)=> {
    res.send(users);
  })
  .catch((err)=> {next(err)});
};

module.exports.postUsers = (req, res, next) => {
  // console.log(req.body);
  // console.log('postUsers');
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
  .then(user => res.send(user))
  .catch(err => res.status(400).send({message: 'Переданы некорректные данные при создании пользователя'}))

};

module.exports.getUserId = (req, res, next) => {
  console.log('getUserId');
  res.send();
};

module.exports.updateUserInfo = (req, res, next) => {
  console.log('updateUserInfo');
  res.send();
};

module.exports.updateUserAvatar = (req, res, next) => {
  console.log('updateUserAvatar');
  res.send();
};