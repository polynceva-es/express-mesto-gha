const mongoose = require('mongoose');
const Card = require('../models/card');
const http2 = require('node:http2');
const { HTTP_STATUS_CREATED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND} = http2.constants;

module.exports.getCards = (req, res, next) => {
  Card.find({})
  .populate(['owner', 'likes'])
  .then((cards)=> {
    res.send(cards);
  })
  .catch((err)=> {next(err)});
};

module.exports.postCards = (req, res, next) => {
  const owner = req.user._id;
  const {name, link} = req.body;
  Card.create({name, link, owner})
    .then(card => {
      card.populate('owner')
      .then(card => res.status(HTTP_STATUS_CREATED).send(card))
      .catch(err => next(err))
    })
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Переданы некорректные данные при создании карточки'});
      }
      else{next(err)}
    })
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  const {cardId} = req.params;
  Card.findOneAndRemove({owner: owner, _id: cardId})
    .then((card)=>{
      if(card) {
        res.send({})
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Карточка с указанным id:${cardId} не найдена`});
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: `Карточка с указанным id:${cardId} не найдена`});
    } else {next(err)}})
};

module.exports.putCardLike = (req, res, next) => {
  const user = req.user._id;
  const {cardId} = req.params;
  Card.findByIdAndUpdate(cardId, {$addToSet: {likes: user}}, {new: true})
    .then((card) => {
      if(card) {
        card.populate(['owner', 'likes'])
        .then(card => res.send(card))
        .catch(err => next(err))
      } else {
        res.status(HTTP_STATUS_NOT_FOUND).send({message: `Карточка с указанным id:${cardId} не найдена`});
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({message: `Карточка с указанным id:${cardId} не найдена`});
      } else {next(err)}
    })
};

module.exports.deleteCardLike = (req, res, next) => {
  const user = req.user._id;
  const {cardId} = req.params;
  Card.findByIdAndUpdate(cardId, {$pull: {likes: user}}, {new: true})
  .then((card) => {
    if(card) {
      card.populate(['owner', 'likes'])
      .then(card => res.send(card))
      .catch(err => next(err))
    } else {
      res.status(HTTP_STATUS_NOT_FOUND).send({message: `Карточка с указанным id:${cardId} не найдена`});
    }
  })
  .catch(err => {
    if(err instanceof mongoose.Error.CastError) {
      res.status(HTTP_STATUS_BAD_REQUEST).send({message: `Карточка с указанным id:${cardId} не найдена`});
    } else {next(err)}
  })
};